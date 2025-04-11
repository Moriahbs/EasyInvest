import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { loginUser, registerUser } from "@/actions/authActions";
import { isTokenValid } from "@/utils/authUtils";
import { FcGoogle } from "react-icons/fc";
import config from "@/config";
import UploadProfile from "@/components/UploadProfile";
import { cn } from "@/lib/utils";

interface AuthForm {
  username: string;
  email?: string;
  password: string;
}

export default function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [generalError, setGeneralError] = useState("");
  const [username, setUsername] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthForm>();

  useEffect(() => {
    validateToken();
  }, [navigate]);

  const validateToken = () => {
    const token = Cookies.get("Authorization") || "";

    if (isTokenValid(token)) {
      navigate("/home");
    }
  };

  const onSubmit = async (data: AuthForm) => {
    try {
      if (isLogin) {
        await loginUser(data.username, data.password);
      } else {
        await registerUser(
          data.username,
          data.email || "",
          data.password,
          image
        );
      }

      validateToken();
    } catch (error: any) {
      if (error.status === 401) {
        setGeneralError("פרטים לא נכונים");
      } else {
        setGeneralError(error.response?.data?.error || "שגיאה בשרת");
      }
    }
  };

  const handleGoogleLogin = () =>
    (window.location.href = `${config.SERVER_URL}/auth/google`);

  const errorClass = "text-red-500 text-xs w-fit ml-1 mt-1";
  const labelClass = "block font-medium text-right mb-1";

  return (
    <div className="w-full flex justify-center">
      <div
        className="flex items-center justify-center bg-gray-100 rounded w-1/2 p-4 font-hebrew"
        dir="rtl"
      >
        <Card className="w-full shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-3xl p-3 !font-normal">
              {isLogin ? "התחברות לEasy Invest" : "הרשמה לEasy Invest"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              onChange={(event: any) => setUsername(event.target.value)}
              className="space-y-4"
            >
              <div className="flex w-full">
                {!isLogin && (
                  <div className="w-1/5 ml-2 mt-6">
                    <UploadProfile
                      username={username}
                      setImage={setImage}
                      isRegister={true}
                    />
                  </div>
                )}

                <div
                  className={cn(!isLogin ? "w-4/5 flex flex-col" : "w-full")}
                >
                  <div>
                    <label className={labelClass}>משתמש</label>
                    <Input
                      type="username"
                      placeholder="שם משתמש"
                      {...register("username", {
                        required: "יש להכניס פרטי שם משתמש",
                      })}
                      className="w-full"
                    />
                    {errors.username && (
                      <p className={errorClass}>{errors.username.message}</p>
                    )}
                  </div>
                  {!isLogin && (
                    <div>
                      <label className={labelClass}>מייל</label>
                      <Input
                        type="email"
                        placeholder="כתובת מייל"
                        {...register("email", {
                          required: "יש להכניס כתובת מייל",
                        })}
                        className="w-full"
                      />
                      {errors.email && (
                        <p className={errorClass}>{errors.email.message}</p>
                      )}
                    </div>
                  )}
                  <div>
                    <label className={labelClass}>סיסמא</label>
                    <Input
                      type="password"
                      placeholder={
                        isLogin ? "********" : "סיסמא בעלת 10 תווים לפחות"
                      }
                      {...register("password", {
                        required: "יש להכניס סיסמא",
                      })}
                      className="w-full"
                    />
                    {errors.password && (
                      <p className={errorClass}>{errors.password.message}</p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-[#5252cb] hover:bg-[#7878e0] border-none mt-4"
                  >
                    {isLogin ? "התחברות" : "הרשמה"}
                  </Button>
                  {generalError && <p className={errorClass}>{generalError}</p>}
                </div>
              </div>
            </form>
            <Button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2 mt-4 bg-white text-gray-600 hover:bg-gray-100 border-transparent"
            >
              <FcGoogle size={20} /> {isLogin ? "Sign in" : "Sign up"} with
              Google
            </Button>
            <p className={errorClass}>{generalError}</p>
            <p className="text-center text-sm mt-4">
              {isLogin ? "עדיין לא רשום?" : "כבר יש לך משתמש?"}{" "}
              <span
                onClick={() => setIsLogin(!isLogin)}
                className="text-gray-600 hover:underline cursor-pointer"
              >
                {isLogin ? "להרשמה" : "להתחברות"}
              </span>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

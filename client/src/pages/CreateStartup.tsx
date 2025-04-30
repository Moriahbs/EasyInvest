import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { isTokenValid } from "@/utils/authUtils";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import StartupForm from "@/components/StartupForm.tsx";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function CreateStartupPage() {
  const navigate = useNavigate();
  const token = Cookies.get("Authorization") || "";
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const validateToken = () => {
      if (!isTokenValid(token)) {
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }
    };
    validateToken();
  }, [token]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        טוען...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Card className="max-w-md p-6 text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              כדי ליצור סטארטאפ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">עליך להתחבר תחילה.</p>
            <Button
              onClick={() => navigate("/")}
              className="bg-blue-600 hover:bg-blue-500"
            >
              התחבר
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-50 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-6 shadow-md">
        <div className="px-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold">יצירת סטארטאפ חדש</h1>
          <Button
            variant="ghost"
            onClick={() => navigate("/home")}
            className="text-black hover:bg-indigo-500 flex items-center gap-2"
          >
            חזור
          </Button>
        </div>
      </div>

      <div dir="rtl" className="font-hebrew px-4 py-8">
        <motion.div
          className="bg-white p-8 rounded-xl shadow-md"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
        >
          <StartupForm />
        </motion.div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import UploadProfile from "@/components/UploadProfile";
import { Label } from "@/components/ui/label";
import { getUser, updateUser, getAllUsers } from "@/actions/profileActions";
import { isTokenValid } from "@/utils/authUtils";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { deleteStartup, getStartupsBySender } from "@/actions/startupActions";
import { Startup } from "@/models/StartupModel";
import StartupList from "@/components/StartupList";
import EditStartup from "@/components/EditStartup";
import StartupOwnerCard from "@/components/StartupOwnerCard";

interface User {
  username: string;
  email: string;
  password: string;
  profilePhotoUrl: string;
}

const initialUser: User = {
  username: "",
  email: "",
  password: "",
  profilePhotoUrl: "",
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>(initialUser);
  const [newUsername, setNewUsername] = useState<string>(user.username);
  const [newEmail, setNewEmail] = useState<string>(user.email);
  const [image, setImage] = useState<File | null>(null);
  const [allUsernames, setAllUsernames] = useState<string[]>([]);
  const [allEmails, setAllEmails] = useState<string[]>([]);
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);
  const [currentStartup, setCurrentStartup] = useState<Startup>();
  const [favorites, setFavorites] = useState<Startup[]>([]);
  const [currentPageInterested, setCurrentPageInterested] = useState(0);


  const token = Cookies.get("Authorization") || "";

  const getStartups = async () => {
    const userStartups = await getStartupsBySender(token);
    setStartups(userStartups);
  };

  useEffect(() => {
    validateToken();
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await getUserDetails();
      await getStartups();
      const allUsers = await getAllUsers();

      const allUsernames = allUsers.map((user: User) => user.username);
      const allEmails = allUsers.map((user: User) => user.email);

      setAllUsernames(
        allUsernames.filter((name: string) => name !== user.username)
      );
      setAllEmails(allEmails.filter((email: string) => email !== user.email));
      setLoading(false);
    };
    fetchData();
  }, []);

  const validateToken = () => {
    if (!isTokenValid(token)) {
      navigate("/");
    }
  };

  const getUserDetails = async () => {
    const currentUser = await getUser(token);

    const { username, email, password, profilePhoto, favorites } = currentUser.data;
    setUser({ username, email, password, profilePhotoUrl: profilePhoto });
    setFavorites(favorites);
  };

  const handleSave = () => {
    try {
      if (newUsername || image) {
        updateUser(token, newUsername, image);
        getUserDetails();
        toast.success("השינויים נשמרו בהצלחה");
      } else {
        toast.info("לא התבצעו שינויים");
      }
    } catch (error) {
      toast.error("קרתה שגיאה בשמירת השינויים");
    }
  };

  const handleEditStartup = async (startup: Startup) => {
    setOpen(true);
    setCurrentStartup(startup);
  };

  const handleDeleteStartup = async (startupId: string) => {
    await deleteStartup(startupId);
    await getStartups();
  };

  return (
    <div className="p-6 space-x-8 flex h-fit w-full justify-around">
      <Card className="h-fit w-1/3 mt-4">
        <CardHeader className="items-center">
          <h2 className="text-3xl font-bold text-gray-800 text-center">
            פרופיל אישי{" "}
          </h2>{" "}
        </CardHeader>
        <CardContent className="flex items-center gap-3 justify-around">
          <UploadProfile
            username={user.username}
            setImage={setImage}
            imageUrl={user.profilePhotoUrl}
            isRegister={false}
          />
          <div className="space-y-4 w-1/2">
            <div>
              <Label htmlFor="username">שם משתמש</Label>
              <Input
                id="username"
                value={newUsername ? newUsername : user.username}
                onChange={(e) => setNewUsername(e.target.value)}
              />
              {allUsernames.includes(newUsername) &&
                !(newUsername === user.username) && (
                  <p className="text-blue-600 text-xs w-fit ml-1 mt-1">
                    שם המשתמש תפוס{" "}
                  </p>
                )}
            </div>
            <div>
              <Label htmlFor="email">כתובת מייל</Label>
              <Input
                id="email"
                value={newEmail ? newEmail : user.email}
                onChange={(e) => setNewEmail(e.target.value)}
              />
              {allEmails.includes(newEmail) && !(newEmail === user.email) && (
                <p className="text-blue-600 text-xs w-fit ml-1 mt-1">
                  כתובת המייל תפוסה{" "}
                </p>
              )}
            </div>

            <Button
              className="w-full"
              onClick={handleSave}
              disabled={
                (!newUsername && !image) ||
                (allUsernames.includes(newUsername) &&
                  !(newUsername === user.username))
              }
            >
              שמירת שינויים{" "}
            </Button>
          </div>
        </CardContent>
      </Card>

      {
        startups.length !== 0 && (
          <div className="p-6 space-x-8 flex flex-col gap-5 h-fit">
            <h2 className="text-3xl font-bold text-gray-800 text-center">הסטארטאפים שלך</h2>
            {
              startups.map((startup) => (
                <StartupOwnerCard
                  startup={startup}
                  setStartups={setStartups}
                  setOpen={setOpen}
                  setCurrentStartup={setCurrentStartup}
                />
              ))
            }
          </div>
        )
      }

      {
        favorites.length !== 0 && (
          <div className="w-full md:w-[35%]">
            <StartupList
              title={'סטארטאפים שהתעניינת בהם'}
              startups={favorites}
              loading={loading}
              setCurrentPage={setCurrentPageInterested}
              currentPage={currentPageInterested}
            />
          </div>
        )
      }
      {
        open && currentStartup && (
          <EditStartup
            open={open}
            setOpen={setOpen}
            startup={currentStartup}
          />
        )
      }
    </div >
  );
}

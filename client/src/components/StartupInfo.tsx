import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Startup } from "@/models/StartupModel.ts";
import {
  MapPin,
  Building,
  Loader2,
  BookmarkCheck,
  Sparkles,
} from "lucide-react";
import config from "@/config.ts";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  addStartupToFavorites,
  deleteStartupFromFavorites,
  getUser,
  getUsersByFavorite,
} from "@/actions/profileActions";
import { User } from "@/models/userModel";
import StartupInfoCard from "./StartupInfoCard";
import ContactModal from "./ContactModal";
import { addStartupToVisited } from "@/actions/startupActions";

interface StartupInfoProps {
  startup: Startup;
}

const StartupInfo: React.FC<StartupInfoProps> = ({ startup }) => {
  const [simplifyLoading, setSimplifyLoading] = useState<boolean>(false);
  const [simplifiedDesc, setSimplifiedDesc] = useState("");
  const [isSimplified, setIsSimplified] = useState<boolean>(false);
  const [favorited, setFavorited] = useState(false);
  const [interestedUsers, setInterestedUsers] = useState<User[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [senderEmail, setSenderEmail] = useState<string>("");
  const token = Cookies.get("Authorization") || "";

  useEffect(() => {
    const fetchAndUpdateData = async () => {
      await getUserDetails();
      await getInterestedUsers();
      await addStartupToVisited(startup._id);
    };
    fetchAndUpdateData();
  }, []);

  const getUserDetails = async () => {
    const currentUser = await getUser(token);
    const { favorites } = currentUser.data as {
      favorites: Startup[];
      _id: string;
    };
    setFavorited(favorites.some((favorite) => favorite._id === startup._id));
  };

  const getInterestedUsers = async () => {
    const users = await getUsersByFavorite(startup._id);
    setInterestedUsers(users);
  };

  const simplifyDescription = async (userInput: string) => {
    if (!isSimplified && !simplifiedDesc) {
      setSimplifyLoading(true);
      const response = await axios.post(
        `${config.SERVER_URL}/api/smartSearch/simplify`,
        {
          userText: userInput,
        }
      );

      setSimplifyLoading(false);
      setSimplifiedDesc(response.data.simplified);
    }
    setIsSimplified(!isSimplified);
  };

  const onSaveClicked = async () => {
    if (favorited) {
      await deleteStartupFromFavorites(startup._id);
    } else {
      await addStartupToFavorites(startup._id);
    }

    setFavorited(!favorited);
  };

  return (
    <div className="min-h-screen bg-white direction-rtl font-rubik">
      <div
        className="relative h-64 bg-cover bg-center"
        style={{
          backgroundImage: startup.image
            ? `url(${config.SERVER_URL}/${startup.image})`
            : "linear-gradient(to right, #3b82f6, #6366f1)",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <button
            onClick={onSaveClicked}
            className="absolute top-3 right-3 p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-40 transition focus:outline-none"
            aria-label="Save to favorites"
          >
            <BookmarkCheck
              className={`w-7 h-7 ${
                favorited ? "text-green-700" : "text-white"
              }`}
            />
          </button>

          <h1 className="text-4xl font-bold text-white">{startup.name}</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-center -mt-16">
          <div className="relative w-32 h-32">
            <img
              src={
                startup.image
                  ? `${config.SERVER_URL}/${startup.image}`
                  : "/src/assets/default-image.png"
              }
              alt={startup.name}
              className="w-full h-full rounded-full border-4 border-white shadow-lg object-cover transition-transform duration-300 hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = "/src/assets/default-image.png";
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="md:col-span-2">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-blue-950 flex items-center gap-2">
                <Building className="w-5 h-5" /> תיאור הסטארטאפ
              </h2>
              <p className="text-gray-700 mt-2 text-lg">
                {startup.description}
              </p>
              {isSimplified && (
                <div className="border rounded-lg p-4 w-fit mt-4 mb-5">
                  <p className="text-green-700 mt-2 text-lg font-bold flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    הסבר במילים פשוטות
                  </p>
                  <p className="text-green-700 mt-2 text-lg">
                    {simplifiedDesc}
                  </p>
                </div>
              )}
              <button
                onClick={() => simplifyDescription(startup.description)}
                className="bg-blue-600 w-1/5 text-white border-none focus:outline-none mt-2 flex items-center justify-center"
              >
                {isSimplified ? (
                  "הסתר"
                ) : (
                  <>
                    תסביר לי
                    {simplifyLoading && (
                      <Loader2 className="w-5 h-5 mr-2 animate-spin text-white" />
                    )}
                  </>
                )}
              </button>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-blue-950 flex items-center gap-2">
                <Building className="w-5 h-5" /> קטגוריות
              </h2>
              <div className="flex flex-wrap gap-2 mt-2">
                {startup.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-600 text-sm font-medium px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-blue-950 flex items-center gap-2">
                <MapPin className="w-5 h-5" /> מיקום
              </h2>
              <div className="h-64 mt-2 rounded-lg shadow-md overflow-hidden">
                <MapContainer
                  center={[startup.latitude, startup.longitude]}
                  zoom={13}
                  className="h-full w-full"
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[startup.latitude, startup.longitude]}>
                    <Popup>{startup.location}</Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          </div>

          <StartupInfoCard
            startup={startup}
            openModal={openModal}
            setOpenModal={setOpenModal}
            setSenderEmail={setSenderEmail}
          />
        </div>
      </div>
      {openModal && senderEmail && senderEmail !== "" && (
        <ContactModal
          open={openModal}
          setOpen={setOpenModal}
          email={senderEmail}
        />
      )}
    </div>
  );
};

export default StartupInfo;

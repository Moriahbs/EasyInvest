import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createStartup, editStartup } from "@/actions/startupActions";
import UploadImage from "../components/UploadImage";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  STARTUP_CATEGORIES,
  FUNDING_STAGES,
  Startup,
} from "../models/StartupModel";
import { MultiSelect } from "../components/ui/multi-select";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Mail,
  Phone,
  Users,
  Building,
  Tag,
  FileText,
  DollarSign,
  Calendar,
} from "lucide-react";

export interface NewStartup {
  name: string;
  tags: string[];
  description: string;
  fundingStage: string;
  foundedYear: number;
  valuationLastRound: number;
  location: string;
  latitude?: number;
  longitude?: number;
  contactEmail: string;
  contactPhone: string;
  founders: string;
  image?: string;
  country: string;
}

interface StartupFormProps {
  existingStartup?: Startup;
}

const StartupForm: React.FC<StartupFormProps> = ({ existingStartup }) => {
  const navigate = useNavigate();
  const [startupDetails, setStartupDetails] = useState<NewStartup>(
    existingStartup || {
      name: "",
      tags: [],
      description: "",
      fundingStage: "",
      foundedYear: 2025,
      valuationLastRound: 0,
      location: "",
      country: "",
      contactEmail: "",
      contactPhone: "",
      founders: "",
    }
  );
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearchLocation = async (value: string) => {
    setStartupDetails({ ...startupDetails, location: value });
    if (value.length < 3) {
      setSearchResults([]);
      return;
    }
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${value}`,
      { headers: { "User-Agent": "MyStartupApp/1.0 (your-email@example.com)" } }
    );
    const data = await res.json();
    setSearchResults(data);
  };

  const handleSelectLocation = (place: any) => {
    setStartupDetails({
      ...startupDetails,
      location: place.display_name,
      latitude: parseFloat(place.lat),
      longitude: parseFloat(place.lon),
      country: place?.address?.country || "",
    });
    setSearchResults([]);
  };

  const handleSubmit = async () => {
    const {
      name,
      tags,
      description,
      fundingStage,
      country,
      foundedYear,
      valuationLastRound,
      latitude,
      longitude,
      location,
      contactEmail,
      contactPhone,
      founders,
    } = startupDetails;
    if (
      !name ||
      !tags.length ||
      !description ||
      !fundingStage ||
      !foundedYear ||
      !valuationLastRound ||
      !location ||
      !contactEmail ||
      !contactPhone ||
      !founders ||
      !country
    ) {
      return toast.error("יש למלא את כל השדות");
    }

    setLoading(true);
    if (existingStartup) {
      editStartup(
        existingStartup._id,
        name,
        tags,
        description,
        fundingStage,
        foundedYear,
        valuationLastRound,
        location,
        latitude || 0,
        longitude || 0,
        contactEmail,
        contactPhone,
        founders,
        country,
        image,
      );
      toast.success("הסטארטאפ עודכן בהצלחה!");
    } else {
      await createStartup(
        name,
        tags,
        description,
        fundingStage,
        foundedYear,
        valuationLastRound,
        location,
        latitude || 0,
        longitude || 0,
        contactEmail,
        contactPhone,
        founders,
        country,
        image,
      );
      toast.success("הסטארטאפ נוצר בהצלחה!");
    }

    setLoading(false);
    navigate("/home");
    setStartupDetails({
      name: "",
      tags: [],
      description: "",
      fundingStage: "",
      foundedYear: 2025,
      valuationLastRound: 0,
      location: "",
      contactEmail: "",
      contactPhone: "",
      founders: "",
      country: ""
    });
  };

  const handleChange = (key: keyof NewStartup, value: any) => {
    setStartupDetails((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <>
      {/* העלאת תמונה */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-right flex items-center gap-2">
          תמונת הסטארטאפ
        </h2>
        <UploadImage setImage={setImage} />
      </div>

      {/* טופס */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-5">
          <div>
            <label className="block font-semibold text-right text-sm mb-2 flex items-center gap-2">
              <Building className="w-4 h-4" /> שם הסטארטאפ
            </label>
            <Input
              className="rounded-lg border-gray-200 focus:ring-indigo-500"
              placeholder="שם הסטארטאפ"
              value={startupDetails.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>

          <div>
            <label className="block font-semibold text-right text-sm mb-2 flex items-center gap-2">
              <Tag className="w-4 h-4" /> קטגוריות
            </label>
            <MultiSelect
              options={STARTUP_CATEGORIES}
              value={startupDetails.tags}
              onChange={(newTags) => handleChange("tags", newTags)}
              placeholder="בחר קטגוריות"
              className="rounded-lg"
            />
          </div>

          <div>
            <label className="block font-semibold text-right text-sm mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" /> תיאור
            </label>
            <Textarea
              className="rounded-lg border-gray-200 focus:ring-indigo-500"
              placeholder="תיאור הסטארטאפ"
              value={startupDetails.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          <div>
            <label className="block font-semibold text-right text-sm mb-2 flex items-center gap-2">
              <DollarSign className="w-4 h-4" /> שלב מימון
            </label>
            <select
              className="w-full p-2 border border-gray-200 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={startupDetails.fundingStage}
              onChange={(e) => handleChange("fundingStage", e.target.value)}
            >
              <option value="" disabled>
                בחר שלב מימון
              </option>
              {FUNDING_STAGES.map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-right text-sm mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> שנת הקמה
            </label>
            <Input
              className="rounded-lg border-gray-200 focus:ring-indigo-500"
              placeholder="שנת הקמה"
              type="number"
              min={1900}
              max={new Date().getFullYear()}
              value={startupDetails.foundedYear}
              onChange={(e) =>
                handleChange("foundedYear", Number(e.target.value))
              }
            />
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block font-semibold text-right text-sm mb-2 flex items-center gap-2">
              <DollarSign className="w-4 h-4" /> שווי בסיבוב האחרון (בשקלים)
            </label>
            <Input
              className="rounded-lg border-gray-200 focus:ring-indigo-500"
              placeholder="שווי בסיבוב האחרון (בשקלים)"
              value={
                startupDetails.valuationLastRound
                  ? `₪ ${Number(
                      startupDetails.valuationLastRound
                    ).toLocaleString("he-IL")}`
                  : ""
              }
              onChange={(e) => {
                const rawValue = e.target.value.replace(/[^\d]/g, "");
                handleChange("valuationLastRound", Number(rawValue));
              }}
            />
          </div>

          <div>
            <label className="block font-semibold text-right text-sm mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4" /> מייל ליצירת קשר
            </label>
            <Input
              className="rounded-lg border-gray-200 focus:ring-indigo-500"
              placeholder="מייל ליצירת קשר"
              type="email"
              value={startupDetails.contactEmail}
              onChange={(e) => handleChange("contactEmail", e.target.value)}
            />
          </div>

          <div>
            <label className="block font-semibold text-right text-sm mb-2 flex items-center gap-2">
              <Phone className="w-4 h-4" /> מספר טלפון ליצירת קשר
            </label>
            <Input
              className="rounded-lg border-gray-200 focus:ring-indigo-500"
              placeholder="מספר טלפון ליצירת קשר"
              type="tel"
              value={startupDetails.contactPhone}
              onChange={(e) => handleChange("contactPhone", e.target.value)}
            />
          </div>

          <div>
            <label className="block font-semibold text-right text-sm mb-2 flex items-center gap-2">
              <Users className="w-4 h-4" /> שם המייסדים
            </label>
            <Input
              className="rounded-lg border-gray-200 focus:ring-indigo-500"
              placeholder="שם המייסדים (מופרדים בפסיקים אם יש כמה)"
              value={startupDetails.founders}
              onChange={(e) => handleChange("founders", e.target.value)}
            />
          </div>

          <div>
            <label className="block font-semibold text-right text-sm mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> מיקום
            </label>
            <Input
              className="rounded-lg border-gray-200 focus:ring-indigo-500"
              placeholder="הקלד מיקום"
              value={startupDetails.location}
              onChange={(e) => handleSearchLocation(e.target.value)}
            />
          </div>
        </div>
      </div>

      {searchResults.length > 0 && (
        <div className="border p-3 mt-4 bg-white rounded-lg shadow-sm max-h-40 overflow-auto">
          {searchResults.map((place, idx) => (
            <div
              key={idx}
              className="cursor-pointer hover:bg-gray-100 p-2 rounded-md transition-colors"
              onClick={() => handleSelectLocation(place)}
            >
              {place.display_name}
            </div>
          ))}
        </div>
      )}

      {startupDetails.latitude && startupDetails.longitude && (
        <div className="h-64 mt-6 rounded-lg shadow-md overflow-hidden">
          <MapContainer
            center={[startupDetails.latitude, startupDetails.longitude]}
            zoom={13}
            className="h-full w-full"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker
              position={[startupDetails.latitude, startupDetails.longitude]}
            >
              <Popup>{startupDetails.location}</Popup>
            </Marker>
          </MapContainer>
        </div>
      )}

      <div className="flex justify-end mt-8">
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-1/4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg py-3 transition-all duration-300"
        >
          {existingStartup
            ? loading
              ? "מעדכן את הסטארטאפ..."
              : "עדכון"
            : loading
            ? "מעלה את הסטארטאפ..."
            : "יצירה"}
        </Button>
      </div>
    </>
  );
};

export default StartupForm;

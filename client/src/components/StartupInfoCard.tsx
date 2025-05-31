import React from "react";
import { Startup } from "@/models/StartupModel.ts";
import {
  ArrowLeftIcon,
  MapPin,
  Mail,
  Phone,
  Users,
  DollarSign,
  Calendar,
} from "lucide-react";
import "leaflet/dist/leaflet.css";
import ContactModal from "@/components/ContactModal.tsx";

interface StartupInfoProps {
  startup: Startup;
  openModal: boolean;
  setOpenModal: (openModal: boolean) => void;
  setSenderEmail: (senderEmail: string) => void;
}

const StartupInfoCard: React.FC<StartupInfoProps> = ({
  startup,
  openModal,
  setOpenModal,
  setSenderEmail,
}) => {
  const valuationInShekels = startup.valuationLastRound.toLocaleString(
    "he-IL",
    {
      style: "currency",
      currency: "ILS",
      maximumFractionDigits: 0,
    }
  );

  return (
    <div className="md:col-span-1 bg-blue-50 rounded-xl p-6 shadow-md h-fit">
      <h2 className="text-xl font-semibold text-blue-950 mb-4">פרטים נוספים</h2>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-blue-600" />
          <div>
            <p className="text-gray-500 text-sm">שווי בסיבוב האחרון</p>
            <p className="text-blue-950 font-bold">{valuationInShekels}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <div>
            <p className="text-gray-500 text-sm">שנת הקמה</p>
            <p className="text-blue-950 font-bold">{startup.foundedYear}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-blue-600" />
          <div>
            <p className="text-gray-500 text-sm">שלב מימון</p>
            <p className="text-blue-950 font-bold">{startup.fundingStage}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          <div>
            <p className="text-gray-500 text-sm">מייסדים</p>
            <p className="text-blue-950 font-bold">{startup.founders}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-blue-600" />
          <div>
            <p className="text-gray-500 text-sm">מייל ליצירת קשר</p>
            <p className="text-blue-950 font-bold">{startup.contactEmail}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Phone className="w-5 h-5 text-blue-600" />
          <div>
            <p className="text-gray-500 text-sm">טלפון ליצירת קשר</p>
            <p className="text-blue-950 font-bold">{startup.contactPhone}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          <div>
            <p className="text-gray-500 text-sm">מיקום</p>
            <p className="text-blue-950 font-bold">{startup.location}</p>
          </div>
        </div>
      </div>

      {startup.contactEmail && (
        <div className="mt-6">
          <button
            onClick={() => {
              setSenderEmail(startup.contactEmail);
              setOpenModal(true);
            }}
            className="bg-blue-600 text-white rounded-full py-2 px-4 text-base font-medium hover:bg-blue-600 transition flex items-center gap-2 w-full justify-center"
          >
            <span>ליצירת קשר</span>
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default StartupInfoCard;

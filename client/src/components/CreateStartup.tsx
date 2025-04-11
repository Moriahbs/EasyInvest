import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createStartup } from "@/actions/startupActions";
import UploadImage from "./UploadImage";
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { STARTUP_CATEGORIES } from "../models/startupModel";
import { MultiSelect } from "./ui/multi-select";
import { toast } from "sonner";

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
  image?: string;
}

export default function CreateStartupModal({
  open,
  setOpen,
  onCreate,
}: {
  open: boolean;
  setOpen: (state: boolean) => void;
  onCreate: (newStartup: any) => void;
}) {
  const [startupDetails, setStartupDetails] = useState<NewStartup>({
    name: "",
    tags: [],
    description: "",
    fundingStage: "",
    foundedYear: 2025,
    valuationLastRound: 0,
    location: "",
  });
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
      `https://nominatim.openstreetmap.org/search?format=json&q=${value}`
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
    });
    setSearchResults([]);
  };

  const handleSubmit = async () => {
    const {
      name,
      tags,
      description,
      fundingStage,
      foundedYear,
      valuationLastRound,
      latitude,
      longitude,
      location,
    } = startupDetails;
    if (
      !name ||
      !tags.length ||
      !description ||
      !fundingStage ||
      !foundedYear ||
      !valuationLastRound ||
      !location
    )
      return toast.error("יש למלא את כל השדות");

    setLoading(true);
    const newStartup = await createStartup(
      name,
      tags,
      description,
      fundingStage,
      foundedYear,
      valuationLastRound,
      location,
      latitude,
      longitude,
      image
    );
    setLoading(false);
    onCreate(newStartup);
    setOpen(false);
    setStartupDetails({
      name: "",
      tags: [],
      description: "",
      fundingStage: "",
      foundedYear: 2025,
      valuationLastRound: 0,
      location: "",
    });
  };

  const labelClass =
    "block font-semibold text-right text-sm leading-tight mb-1";
  const inputClass = "mb-[0.6rem]";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent dir="rtl" className="font-hebrew max-w-4xl w-full">
        <DialogHeader>
          <DialogTitle className="text-2xl flex justify-center">
            יצירת סטארטאפ חדש
          </DialogTitle>
        </DialogHeader>

        <div className="flex w-full">
          <div className="w-1/4">
            <UploadImage setImage={setImage} />
          </div>

          <div className="w-3/4 flex flex-col">
            <label className={labelClass}>שם הסטארטאפ</label>
            <Input
              className={inputClass}
              placeholder="שם קליט שייצג את הסטארטאפ"
              value={startupDetails.name}
              onChange={(e) =>
                setStartupDetails({ ...startupDetails, name: e.target.value })
              }
            />

            <label className={labelClass}>קטגוריות</label>
            <MultiSelect
              options={STARTUP_CATEGORIES}
              value={startupDetails.tags}
              onChange={(newTags) =>
                setStartupDetails({
                  ...startupDetails,
                  tags: newTags,
                })
              }
              placeholder="קטגוריות"
              className={inputClass}
            />

            <label className={labelClass}>תיאור</label>
            <Textarea
              className={inputClass}
              placeholder="תיאור"
              value={startupDetails.description}
              onChange={(e) =>
                setStartupDetails({
                  ...startupDetails,
                  description: e.target.value,
                })
              }
            />

            <label className={labelClass}>שלב מימון</label>
            <Input
              className={inputClass}
              placeholder="שלב מימון"
              value={startupDetails.fundingStage}
              onChange={(e) =>
                setStartupDetails({
                  ...startupDetails,
                  fundingStage: e.target.value,
                })
              }
            />

            <label className={labelClass}>שנת הקמה</label>
            <Input
              className={inputClass}
              placeholder="שנת הקמה"
              type="number"
              min={1900}
              max={new Date().getFullYear()}
              value={startupDetails.foundedYear}
              onChange={(e) =>
                setStartupDetails({
                  ...startupDetails,
                  foundedYear: e.target.value,
                })
              }
            />

            <label className={labelClass}>שווי בסיבוב האחרון (בשקלים)</label>
            <Input
              className={inputClass}
              placeholder="שווי בסיבוב האחרון (בשקלים)"
              value={
                startupDetails.valuationLastRound
                  ? `₪ ${Number(
                      startupDetails.valuationLastRound
                    ).toLocaleString("he-IL")}`
                  : ""
              }
              onChange={(e) => {
                const rawValue = e.target.value.replace(/[^\d]/g, ""); // remove non-numbers
                setStartupDetails({
                  ...startupDetails,
                  valuationLastRound: rawValue,
                });
              }}
            />

            <label className={labelClass}>מיקום</label>
            <Input
              className={inputClass}
              placeholder="הקלד מיקום"
              value={startupDetails.location}
              onChange={(e) => handleSearchLocation(e.target.value)}
            />

            {searchResults.length > 0 && (
              <div className="border p-2 mb-2 bg-white max-h-40 overflow-auto">
                {searchResults.map((place, idx) => (
                  <div
                    key={idx}
                    className="cursor-pointer hover:bg-gray-200 p-1"
                    onClick={() => handleSelectLocation(place)}
                  >
                    {place.display_name}
                  </div>
                ))}
              </div>
            )}

            {startupDetails.latitude && startupDetails.longitude && (
              <div className="h-60 mt-2">
                <MapContainer
                  center={[startupDetails.latitude, startupDetails.longitude]}
                  zoom={13}
                  className="h-full w-full rounded-md"
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker
                    position={[
                      startupDetails.latitude,
                      startupDetails.longitude,
                    ]}
                  >
                    <Popup>{startupDetails.location}</Popup>
                  </Marker>
                </MapContainer>
              </div>
            )}

            <div className="w-full flex justify-end">
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-1/3 bg-[#5252cb] hover:bg-[#7878e0] border-none mt-2 just"
              >
                {loading ? "מעלה את הסטארטאפ..." : "יצירה"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import React from "react";
import { Startup } from "@/models/StartupModel.ts";
import { ArrowLeftIcon, MapPin, Mail, Phone, Users, DollarSign, Calendar, Building } from "lucide-react";
import config from "@/config.ts";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface StartupInfoProps {
    startup: Startup;
}

const StartupInfo: React.FC<StartupInfoProps> = ({ startup }) => {
    const valuationInShekels = startup.valuationLastRound.toLocaleString("he-IL", {
        style: "currency",
        currency: "ILS",
        maximumFractionDigits: 0,
    });

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
                    <h1 className="text-4xl font-bold text-white">{startup.name}</h1>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex justify-center -mt-16">
                    <div className="relative w-32 h-32">
                        <img
                            src={startup.image ? `${config.SERVER_URL}/${startup.image}` : "/src/assets/default-image.png"}
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
                            <p className="text-gray-700 mt-2 text-lg">{startup.description}</p>
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

                    <div className="md:col-span-1 bg-blue-50 rounded-xl p-6 shadow-md">
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

                        <div className="mt-6">
                            <button className="bg-purple-600 text-white rounded-full py-2 px-4 text-base font-medium hover:bg-purple-700 transition flex items-center gap-2 w-full justify-center">
                                <span>ליצירת קשר</span>
                                {/*//TODO: email and stuff*/}
                                <ArrowLeftIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StartupInfo;
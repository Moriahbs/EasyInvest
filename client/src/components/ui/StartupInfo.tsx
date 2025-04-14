// StartupInfo.tsx
import React from 'react';
import { Startup } from '@/models/StartupModel.ts';
// import { ArrowLeftIcon } from '@heroicons/react/24/solid'; // החלפה של ArrowForwardIcon

interface StartupInfoProps {
    startup: Startup;
}

const StartupInfo: React.FC<StartupInfoProps> = ({ startup }) => {
    const valuationInShekels = startup.valuationLastRound.toLocaleString('he-IL', {
        style: 'currency',
        currency: 'ILS',
        maximumFractionDigits: 0,
    });

    return (
        <div
            className="max-w-4xl rounded-2xl shadow-lg bg-blue-50 p-6 direction-rtl font-rubik"
        >
            <div>
                {/* כותרת עם לוגו ושם החברה */}
                <div className="flex items-center mb-6 flex-row-reverse gap-8">
                    {/* לוגו עגול */}
                    <div className="relative w-32 h-32 ml-2">
                        <img
                            src="/path-to-logo.png" //TODO
                            alt="לוגו"
                            className="w-full h-full rounded-full bg-blue-950 text-white flex items-center justify-center"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling!.style.display = 'flex';
                            }}
                        />
                        <div
                            className="w-full h-full rounded-full bg-blue-950 text-white flex items-center justify-center text-2xl hidden"
                        >
                            לוגו
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-blue-950">
                        {startup.companyName} {/* תיקון מ-startup.name ל-startup.companyName */}
                    </h1>
                </div>

                {/* תיאור */}
                <p
                    className="text-blue-950 mb-6 text-right direction-rtl text-lg"
                >
                    {startup.description}
                </p>

                {/* תגיות */}
                <div className="flex flex-wrap gap-2 mb-6 justify-start">
                    {startup.tags.map((tag, index) => (
                        <span
                            key={index}
                            className="bg-blue-100 text-blue-600 text-sm font-medium px-3 py-1 rounded-full mr-2"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* סטטיסטיקות */}
                <div className="flex justify-between mb-6 text-center">
                    {/* שווי בסיבוב האחרון */}
                    <div
                        className="bg-white rounded-lg p-4 shadow-sm w-full h-24 flex flex-col justify-center items-center mx-2"
                    >
                        <p className="text-gray-500 text-sm">שווי בסיבוב האחרון</p>
                        <h2 className="text-xl font-bold text-blue-950">{valuationInShekels}</h2>
                    </div>
                    {/* שנת הקמה */}
                    <div
                        className="bg-white rounded-lg p-4 shadow-sm w-full h-24 flex flex-col justify-center items-center mx-2"
                    >
                        <p className="text-gray-500 text-sm">שנת הקמה</p>
                        <h2 className="text-xl font-bold text-blue-950">{startup.foundedYear}</h2>
                    </div>
                    {/* שלב מימון */}
                    <div
                        className="bg-white rounded-lg p-4 shadow-sm w-full h-24 flex flex-col justify-center items-center mx-2"
                    >
                        <p className="text-gray-500 text-sm">שלב מימון</p>
                        <h2 className="text-xl font-bold text-blue-950">{startup.fundingStage}</h2>
                    </div>
                </div>

                {/* כפתור */}
                <div className="flex justify-start mt-6">
                    <button
                        className="bg-purple-600 text-white rounded-full py-2 px-4 text-base font-medium hover:bg-purple-700 transition flex items-center gap-2"
                    >
                        <span>לפרטים נוספים</span>
                        {/*<ArrowLeftIcon className="w-5 h-5" />*/} //todo with tailwind
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StartupInfo;
import React, { useState } from "react";
import { FUNDING_STAGES, STARTUP_CATEGORIES } from "@/models/StartupModel";
import { FilterMultiSelect } from "./ui/filter-multi-select";

interface FilterBarProps {
  region: string;
  setRegion: React.Dispatch<React.SetStateAction<string>>;
  fundingStages: string[];
  setFundingStages: React.Dispatch<React.SetStateAction<string[]>>;
  categories: string[];
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
  valuation: string;
  setValuation: React.Dispatch<React.SetStateAction<string>>;
}

const FilterBar: React.FC<FilterBarProps> = ({
  region,
  setRegion,
  fundingStages,
  setFundingStages,
  categories,
  setCategories,
  valuation,
  setValuation,
}) => {
  const VALUATION_OPTIONS = [
    { label: "עד 5 מיליון ₪", value: 5000000 },
    { label: "5-10 מיליון ₪", value: [5000000, 10000000] },
    { label: "10-20 מיליון ₪", value: [10000000, 20000000] },
    { label: "מעל 20 מיליון ₪", value: 20000000 },
  ];

  const HEBREW_COUNTRIES = [
    "ארצות הברית",
    "קנדה",
    "צרפת",
    "גרמניה",
    "בריטניה",
    "אוסטרליה",
    "הודו",
    "סין",
    "יפן",
    "ברזיל",
    "רוסיה",
    "ישראל",
    "ספרד",
    "איטליה",
    "אחר",
  ];

  const valuationFilter =
    valuation !== ""
      ? VALUATION_OPTIONS[Number(valuation)].value
      : null;


  return (
    <div
      className="flex flex-wrap items-center gap-3 p-2 bg-gray-100 w-full rounded-lg shadow-sm"
      dir="rtl"
    >
      {/* Region Select */}
      <div className="relative min-w-[130px] pt-5 pb-5">
        {region && (
          <div className="absolute top-0 right-0 flex items-center justify-between w-full text-blue-500 text-sm px-2">
            <span>אזור</span>
            <span
              onClick={() => setRegion("")}
              className="cursor-pointer font-bold"
            >
              ✕
            </span>
          </div>
        )}
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="w-full border border-blue-500 text-blue-500 px-4 py-2 rounded-lg appearance-none bg-white hover:bg-blue-50"
        >
          <option value="" disabled hidden>
            אזור
          </option>
          {HEBREW_COUNTRIES.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500">
          ▼
        </span>
      </div>

      <FilterMultiSelect
        selected={fundingStages}
        options={FUNDING_STAGES}
        onChange={setFundingStages}
        label="שלב מימון"
      />

      <FilterMultiSelect
        selected={categories}
        options={STARTUP_CATEGORIES}
        onChange={setCategories}
        label="קטגוריות"
      />

      <div className="relative min-w-[200px] pt-5 pb-5">
        {valuationFilter !== null && (
          <div className="absolute top-0 right-0 flex items-center justify-between w-full text-blue-500 text-sm px-2">
            <span>שווי בסיבוב האחרון</span>
            <span
              onClick={() => setValuation("")}
              className="cursor-pointer font-bold"
            >
              ✕
            </span>
          </div>
        )}
        <select
          value={valuation}
          onChange={(e) => setValuation(e.target.value)}
          className="w-full border border-blue-500 text-blue-500 px-4 py-2 rounded-lg appearance-none bg-white hover:bg-blue-50"
        >
          <option value="" disabled hidden>
            שווי בסיבוב האחרון (₪)
          </option>
          {VALUATION_OPTIONS.map((option, index) => (
            <option key={index} value={index.toString()}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500">
          ▼
        </span>
      </div>

      <div className="flex gap-2 mt-2 md:mt-0">
        <button
          onClick={() => {
            setRegion("");
            setFundingStages([]);
            setCategories([]);
            setValuation("");
          }}
          className="px-4 py-2 bg-red-100 text-red-500 rounded-lg hover:bg-red-200 transition"
        >
          נקה חיפוש
        </button>
      </div>
    </div>
  );
};

export default FilterBar;

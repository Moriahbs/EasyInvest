import { FUNDING_STAGES, STARTUP_CATEGORIES } from "@/models/StartupModel";
import React, { useState } from "react";
import { FilterMultiSelect } from "./ui/filter-multi-select";

const FilterBar: React.FC = () => {
  const VALUATION_OPTIONS = [
    { label: "עד 5 מיליון ₪", value: 5000000 },
    { label: "5-10 מיליון ₪", value: [5000000, 10000000] },
    { label: "10-20 מיליון ₪", value: [10000000, 20000000] },
    { label: "מעל 20 מיליון ₪", value: 20000000 },
  ];

  const [fundingStages, setFundingStages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [region, setRegion] = useState("");
  const [valuation, setValuation] = useState<string>("");

  const valuationFilter =
  valuation !== ""
      ? VALUATION_OPTIONS[Number(valuation)].value
      : null;

  const resetValuation = () => setValuation("");
  const resetRegion = () => setRegion("");

  return (
    <div
      className="flex flex-wrap items-center gap-3 p-2 bg-gray-100 w-full rounded-lg shadow-sm"
      dir="rtl"
    >
      {/* Search Input */}
      <div className="relative min-w-[250px]">
        <input
          type="text"
          placeholder="חיפוש"
          className="w-full border border-blue-500 text-blue-500 px-4 py-2 rounded-lg placeholder-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500">
          🔍
        </span>
      </div>

      {/* Region Select */}
      <div className="relative min-w-[130px] pt-5 pb-5">
        {region && (
          <div className="absolute top-0 right-0 flex items-center justify-between w-full text-blue-500 text-sm px-2">
            <span>אזור</span>
            <span onClick={resetRegion} className="cursor-pointer font-bold">
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
          <option value="צפון">צפון</option>
          <option value="מרכז">מרכז</option>
          <option value="דרום">דרום</option>
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
            <span onClick={resetValuation} className="cursor-pointer font-bold">
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

      {/* Action Buttons */}
      <div className="flex gap-2 mt-2 md:mt-0">
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
          סנן
        </button>
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

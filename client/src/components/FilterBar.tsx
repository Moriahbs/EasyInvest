import React from "react";

const FilterBar: React.FC = () => {
  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-gray-100 w-full rounded-lg shadow-sm" dir="rtl">
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
      <div className="relative min-w-[130px]">
        <select className="w-full border border-blue-500 text-blue-500 px-4 py-2 rounded-lg appearance-none bg-white hover:bg-blue-50">
          <option>אזור</option>
          <option>צפון</option>
          <option>מרכז</option>
          <option>דרום</option>
        </select>
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500">▼</span>
      </div>

      {/* Property Type Select */}
      <div className="relative min-w-[170px]">
        <select className="w-full border border-blue-500 text-blue-500 px-4 py-2 rounded-lg appearance-none bg-white hover:bg-blue-50">
          <option>סוג נכס (למגורים)</option>
          <option>דירה</option>
          <option>בית פרטי</option>
          <option>וילה</option>
        </select>
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500">▼</span>
      </div>

      {/* Rooms Select */}
      <div className="relative min-w-[130px]">
        <select className="w-full border border-blue-500 text-blue-500 px-4 py-2 rounded-lg appearance-none bg-white hover:bg-blue-50">
          <option>חדרים</option>
          <option>1-2 חדרים</option>
          <option>3-4 חדרים</option>
          <option>5+ חדרים</option>
        </select>
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500">▼</span>
      </div>

      {/* Price Select */}
      <div className="relative min-w-[140px]">
        <select className="w-full border border-blue-500 text-blue-500 px-4 py-2 rounded-lg appearance-none bg-white hover:bg-blue-50">
          <option>תקציב עד 3M</option>
          <option>עד 1M</option>
          <option>1M-2M</option>
          <option>2M-3M</option>
        </select>
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500">▼</span>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-2 md:mt-0">
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
          סנן
        </button>
        <button className="px-4 py-2 bg-red-100 text-red-500 rounded-lg hover:bg-red-200 transition">
          נקה חיפוש
        </button>
      </div>
    </div>
  );
};

export default FilterBar;

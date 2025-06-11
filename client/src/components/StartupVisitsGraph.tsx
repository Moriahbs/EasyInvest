import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getVisitsData } from "@/actions/startupActions";

export type Range = "daily" | "monthly";

export default function StartupVisitsGraph({ startupId }: { startupId: string }) {
  const [view, setView] = useState<Range>("daily");
  const [visitData, setVisitData] = useState([]);

  useEffect(() => {
    const fetchVisits = async () => {
      const data = await getVisitsData(startupId, view);
      setVisitData(data);
    };
    fetchVisits();
  }, [view]);

  return (
    <div className="w-[100%] h-96 p-4 bg-white rounded-2xl shadow">
      <div className="flex justify-between items-center mb-4">
        <div
          dir="rtl"
          className="relative inline-flex items-center bg-gray-200 rounded-full cursor-pointer select-none w-[120px] h-8 overflow-hidden"
        >
          <div
            className={`absolute right-0 top-0 h-full w-1/2 bg-blue-600 rounded-full transition-transform duration-300 ease-in-out ${view === "monthly" ? "-translate-x-full" : "translate-x-0"
              }`}
          />

          <button
            onClick={() => setView("daily")}
            className={`relative z-10 bg-transparent flex-1 text-center py-1 text-xs font-semibold transition-colors duration-300 focus:outline-none focus:ring-0 border-none
 ${view === "daily" ? "text-white" : "text-gray-700"
              }`}
          >
            שבועי
          </button>

          <button
            onClick={() => setView("monthly")}
            className={`relative z-10 bg-transparent flex-1 text-center py-1 text-xs font-semibold transition-colors duration-300 focus:outline-none focus:ring-0 border-none
 ${view === "monthly" ? "text-white" : "text-gray-700"
              }`}
          >
            חודשי
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={visitData} margin={{ top: 15, bottom: 6 }}>
          <XAxis dataKey="date" tickLine={false} axisLine={false} />
          <YAxis
            tick={{
              fontSize: 15,
              dy: -10,
            }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            wrapperStyle={{
              zIndex: 10,
            }}
            contentStyle={{
              borderRadius: "8px",
            }}
            cursor={{ fill: "rgba(0,0,0,0.05)" }}
          />
          <Bar dataKey="allVisits" fill="#2563EB" name="כל הכניסות" />
          <Bar dataKey="uniqueVisits" fill="#83b1ee" name="כניסות חדשות" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

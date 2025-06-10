import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
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
    <div className="h-96 p-4 bg-white rounded-2xl shadow">
      <div className="flex justify-between items-center mb-4">
        <Select
          onValueChange={(val) => setView(val as Range)}
          defaultValue="daily"
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">שבוע אחרון</SelectItem>
            <SelectItem value="monthly">חודשי</SelectItem>
          </SelectContent>
        </Select>
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

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Startup } from "@/models/StartupModel";
import { getUsersByFavorite } from "@/actions/profileActions";
import { User } from "@/models/userModel";

export default function StartupSavesGraph({ startup }: { startup: Startup }) {
  const [interestedUsers, setInterestedUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchAndUpdateData = async () => {
      await getInterestedUsers();
    };
    fetchAndUpdateData();
  }, []);

  const getInterestedUsers = async () => {
    const users = await getUsersByFavorite(startup._id);
    setInterestedUsers(users);
  };

  const pieData = [
    {
      name: "צפו",
      value: Array.from(
        new Map(
          startup?.visits?.map((visit) => [visit.user._id, visit])
        ).values()
      ).length,
    },
    { name: "שמרו", value: interestedUsers.length || 0 },
  ];

  const COLORS = ["#2563EB", "#10B981"];

  return (
    <div className="w-full h-[450px] p-4 bg-white rounded-2xl shadow flex items-center justify-center">
      {pieData[0].value && pieData[1].value ? (
        <PieChart width={320} height={320}>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
            labelLine={false}
            label={({ value }) => value}
          >
            {pieData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            content={({ payload }) => (
              <ul className="flex justify-center gap-6 text-right">
                {payload?.map((entry, index) => (
                  <li key={`item-${index}`} className="flex items-center gap-2">
                    <span
                      className="inline-block w-3 h-3 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    ></span>
                    <span className="mr-1">{entry.value}</span>
                  </li>
                ))}
              </ul>
            )}
          />
        </PieChart>
      ) : (
        <div className="size-full items-center flex justify-center">
          <p className="text-gray-600 ml-3">אין נתונים להצגה</p>
        </div>
      )}
    </div>
  );
}

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
            name: "צפו", value: Array.from(
                new Map(startup?.visits?.map(visit => [visit.user._id, visit])).values()
            ).length
        },
        { name: "שמרו", value: interestedUsers.length || 0 },
    ];

    const COLORS = ["#2563EB", "#10B981"];

    return (
        <div className="w-full h-[450px] p-4 bg-white rounded-2xl shadow flex items-center justify-center">
            <PieChart width={320} height={320}>
                <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    fill="#8884d8"
                    label
                >
                    {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </div>
    );
}

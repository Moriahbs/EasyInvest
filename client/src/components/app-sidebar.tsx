import { Home, LogOut, UserPen, Map, Plus } from "lucide-react";
import { logoutUser } from "@/actions/authActions";
import { useNavigate } from "react-router-dom";

const items = [
  {
    title: "ראשי",
    url: "/home",
    icon: Home,
  },
  {
    title: "פרופיל",
    url: "/profile",
    icon: UserPen,
  },
  {
    title: "מפה",
    url: "/map",
    icon: Map,
  },
  {
    title: "יצירת סטארטאפ",
    url: "/create-startup",
    icon: Plus,
  },
];

export function AppSidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  return (
    <div className="bg-gray-800 text-white py-4 px-6 shadow-md">
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold">Easy Invest</div>

        <div className="flex gap-4">
          {items.map((item) => (
            <a
              key={item.title}
              href={item.url}
              className="flex items-center gap-1 p-2 rounded-md"
            >
              <item.icon />
              <span>{item.title}</span>
            </a>
          ))}

          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 gap-1 bg-gray-800 p-2 rounded-md hover:text-blue-400"
          >
            <LogOut />
            <span>התנתקות</span>
          </button>
        </div>
      </div>
    </div>
  );
}
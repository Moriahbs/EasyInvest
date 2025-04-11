import { Home, LogOut, UserPen, Map } from "lucide-react";
import { logoutUser } from "@/actions/authActions";
import { useNavigate } from "react-router-dom";

const items = [
  {
    title: "Home",
    url: "home",
    icon: Home,
  },
  {
    title: "Profile",
    url: "profile",
    icon: UserPen,
  },
  {
    title: "Map",
    url: "map",
    icon: Map,
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

        <div className="flex space-x-6">
          {items.map((item) => (
            <a
              key={item.title}
              href={item.url}
              className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-md"
            >
              <item.icon />
              <span>{item.title}</span>
            </a>
          ))}

          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-md"
          >
            <LogOut />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}

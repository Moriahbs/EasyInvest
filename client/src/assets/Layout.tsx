import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/SideBar";

export default function Layout() {
  return (
    <div className="flex flex-col h-screen">
      <Sidebar />

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

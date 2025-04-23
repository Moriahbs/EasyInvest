import { Outlet, useLocation } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";

export default function Layout() {
  return (
    <div className="flex flex-col h-screen">
      {/* Top Bar */}
      <AppSidebar />

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

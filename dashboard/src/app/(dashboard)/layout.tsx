"use client";

import { useState } from "react";
import { SessionProvider } from "next-auth/react";
import { SimulationProvider } from "@/context/SimulationContext";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import NotificationPanel from "@/components/NotificationPanel";
import Toasts from "@/components/Toasts";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <SessionProvider>
      <SimulationProvider>
        <div className="min-h-screen bg-bg">
          <Sidebar
            onNotifToggle={() => setNotifOpen((o) => !o)}
            mobileOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          <main className="md:ml-[240px] p-6 md:p-8 lg:p-12 max-w-[1200px]">
            <TopBar
              onMenuToggle={() => setSidebarOpen((o) => !o)}
              onNotifToggle={() => setNotifOpen((o) => !o)}
            />
            {children}
          </main>

          <NotificationPanel
            open={notifOpen}
            onClose={() => setNotifOpen(false)}
          />
          <Toasts />
        </div>
      </SimulationProvider>
    </SessionProvider>
  );
}

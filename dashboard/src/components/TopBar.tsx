"use client";

import { useSim } from "@/context/SimulationContext";
import { Menu, Bell } from "lucide-react";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default function TopBar({
  onMenuToggle,
  onNotifToggle,
}: {
  onMenuToggle: () => void;
  onNotifToggle: () => void;
}) {
  const { sensors } = useSim();
  const fill = sensors.fillLevel;
  const aqi = sensors.aqi;

  let statusText = "Happy";
  let statusClass = "bg-success-bg text-success";
  if (fill > 85 || aqi > 200) {
    statusText = "Needs Attention";
    statusClass = "bg-danger-bg text-danger";
  } else if (fill > 60 || aqi > 120) {
    statusText = "Keep an Eye";
    statusClass = "bg-warning-bg text-warning";
  }

  return (
    <div className="mb-12">
      {/* Mobile header */}
      <div className="flex items-center justify-between md:hidden mb-4">
        <button
          onClick={onMenuToggle}
          className="w-10 h-10 flex items-center justify-center rounded-lg bg-surface-container"
        >
          <Menu size={22} />
        </button>
        <span className="font-display text-xl font-extrabold bg-gradient-to-br from-primary to-primary-container bg-clip-text text-transparent">
          MRBin
        </span>
        <button
          onClick={onNotifToggle}
          className="w-10 h-10 flex items-center justify-center rounded-lg bg-surface-container"
        >
          <Bell size={22} />
        </button>
      </div>

      {/* Desktop top bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-[2rem] font-bold tracking-tight">
            {getGreeting()}, Admin
          </h1>
          <p className="text-on-surface-variant text-[0.9rem]">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div
          className={`hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full text-[0.8rem] font-semibold ${statusClass}`}
        >
          <span className="w-2 h-2 rounded-full bg-current animate-pulse-dot" />
          {statusText}
        </div>
      </div>
    </div>
  );
}

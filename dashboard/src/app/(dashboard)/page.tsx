"use client";

import { useSim } from "@/context/SimulationContext";
import { timeAgo } from "@/lib/utils";
import { Thermometer, Clock, Package, Wind } from "lucide-react";

function AqiBadge({ aqi }: { aqi: number }) {
  if (aqi < 80)
    return (
      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-success-bg text-success">
        Fresh
      </span>
    );
  if (aqi < 150)
    return (
      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-warning-bg text-warning">
        Moderate
      </span>
    );
  return (
    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-danger-bg text-danger">
      Poor
    </span>
  );
}

export default function DashboardPage() {
  const { sensors, friendMsgs } = useSim();
  const fillOffset = 263.9 - (sensors.fillLevel / 100) * 263.9;

  return (
    <div>
      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {/* Weight */}
        <div className="bg-surface-lowest rounded-[3rem] p-8 shadow-[0_8px_40px_rgba(46,47,45,0.06)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[120px] h-[120px] bg-primary-container opacity-15 rounded-bl-full" />
          <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wider mb-3">
            Current Weight
          </p>
          <div>
            <span className="font-display text-5xl font-extrabold tracking-tight">
              {sensors.weight.toFixed(1)}
            </span>
            <span className="text-xl font-semibold text-on-surface-variant ml-1">
              kg
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-3">
            HX711 Load Cell
          </p>
        </div>

        {/* Fill Level */}
        <div className="bg-surface-lowest rounded-[3rem] p-8 shadow-[0_8px_40px_rgba(46,47,45,0.06)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[120px] h-[120px] bg-primary-container opacity-15 rounded-bl-full" />
          <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wider mb-3">
            Fill Level
          </p>
          <div className="flex items-center gap-8">
            <div className="relative w-[100px] h-[100px] shrink-0">
              <svg width="100" height="100" className="-rotate-90">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#e9e8e4"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#715800"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray="263.9"
                  strokeDashoffset={fillOffset}
                  className="transition-all duration-600"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center font-display text-2xl font-extrabold">
                {Math.round(sensors.fillLevel)}%
              </span>
            </div>
            <div>
              <p className="text-sm text-on-surface-variant">
                JSN-SR04T Ultrasonic
              </p>
              <p className="text-xs text-on-surface-variant mt-1">
                {sensors.fillCm} cm free
              </p>
            </div>
          </div>
        </div>

        {/* Air Quality */}
        <div className="bg-surface-lowest rounded-[3rem] p-8 shadow-[0_8px_40px_rgba(46,47,45,0.06)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[120px] h-[120px] bg-primary-container opacity-15 rounded-bl-full" />
          <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wider mb-3">
            Air Quality
          </p>
          <div>
            <span className="font-display text-5xl font-extrabold tracking-tight">
              {Math.round(sensors.aqi)}
            </span>
            <span className="text-xl font-semibold text-on-surface-variant ml-1">
              AQI
            </span>
          </div>
          <div className="mt-2">
            <AqiBadge aqi={sensors.aqi} />
          </div>
          <p className="text-xs text-on-surface-variant mt-3">
            MQ135 Gas Sensor
          </p>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
        <div className="bg-surface-low rounded-[2rem] p-5">
          <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center mb-3">
            <Thermometer size={18} className="text-primary" />
          </div>
          <div className="font-display text-2xl font-bold">
            {sensors.temperature.toFixed(1)}°C
          </div>
          <div className="text-xs text-on-surface-variant">Temperature</div>
        </div>
        <div className="bg-surface-low rounded-[2rem] p-5">
          <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center mb-3">
            <Clock size={18} className="text-primary" />
          </div>
          <div className="font-display text-2xl font-bold">
            {timeAgo(sensors.lastInteraction)}
          </div>
          <div className="text-xs text-on-surface-variant">
            Last Interaction
          </div>
        </div>
        <div className="bg-surface-low rounded-[2rem] p-5">
          <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center mb-3">
            <Package size={18} className="text-primary" />
          </div>
          <div className="font-display text-2xl font-bold">
            {sensors.lidOpen ? "Open" : "Closed"}
          </div>
          <div className="text-xs text-on-surface-variant">Lid Status</div>
        </div>
        <div className="bg-surface-low rounded-[2rem] p-5">
          <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center mb-3">
            <Wind size={18} className="text-primary" />
          </div>
          <div className="font-display text-2xl font-bold">
            {sensors.freshenerOn ? "Active" : "Off"}
          </div>
          <div className="text-xs text-on-surface-variant">Air Freshener</div>
        </div>
      </div>

      {/* Friend Messages */}
      <div>
        <h2 className="font-display text-2xl font-bold mb-5">
          Your Bin Says...
        </h2>
        <div className="space-y-5">
          {friendMsgs.map((m, i) => (
            <div
              key={i}
              className="flex gap-5 p-5 bg-surface-lowest rounded-[2rem] shadow-[0_4px_20px_rgba(46,47,45,0.06)]"
            >
              <div className="w-11 h-11 rounded-full bg-primary-container flex items-center justify-center text-xl shrink-0">
                🗑️
              </div>
              <div className="flex-1">
                <p className="text-[0.9rem] leading-relaxed">{m.text}</p>
                <p className="text-xs text-on-surface-variant mt-1">
                  {timeAgo(m.time)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

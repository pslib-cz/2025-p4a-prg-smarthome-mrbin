"use client";

import { useState, useMemo } from "react";
import { useSim, HistoryPoint } from "@/context/SimulationContext";
import Chip from "@/components/Chip";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  AreaChart,
  ReferenceArea,
} from "recharts";

const ranges = [
  { label: "1H", minutes: 60 },
  { label: "6H", minutes: 360 },
  { label: "24H", minutes: 1440 },
  { label: "7D", minutes: 10080 },
];

const activityColors: Record<string, string> = {
  info: "#715800",
  warn: "#8a6c00",
  alert: "#9e3b2f",
  success: "#3a6e34",
};

function formatTime(t: number) {
  return new Date(t).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function filterByRange(data: HistoryPoint[], minutes: number) {
  const cutoff = Date.now() - minutes * 60000;
  return data
    .filter((d) => d.t >= cutoff)
    .map((d) => ({ time: d.t, value: +d.v.toFixed(2) }));
}

function ChartCard({
  title,
  data,
  yDomain,
  color = "#715800",
  zones,
}: {
  title: string;
  data: { time: number; value: number }[];
  yDomain?: [number, number];
  color?: string;
  zones?: { y1: number; y2: number; fill: string }[];
}) {
  return (
    <div className="bg-surface-low rounded-[2rem] p-8">
      <h3 className="font-display font-bold mb-5">{title}</h3>
      <div className="bg-surface-lowest rounded-[1.5rem] p-3 h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`grad-${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.15} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#e4e2de" strokeDasharray="3 3" vertical={false} />
            {zones?.map((z, i) => (
              <ReferenceArea
                key={i}
                y1={z.y1}
                y2={z.y2}
                fill={z.fill}
                fillOpacity={1}
              />
            ))}
            <XAxis
              dataKey="time"
              tickFormatter={formatTime}
              tick={{ fontSize: 10, fill: "#6b6a67" }}
              axisLine={false}
              tickLine={false}
              minTickGap={40}
            />
            <YAxis
              domain={yDomain || ["auto", "auto"]}
              tick={{ fontSize: 10, fill: "#6b6a67" }}
              axisLine={false}
              tickLine={false}
              width={35}
            />
            <Tooltip
              labelFormatter={(v) => formatTime(v as number)}
              contentStyle={{
                background: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(20px)",
                borderRadius: "1rem",
                border: "none",
                boxShadow: "0 4px 20px rgba(46,47,45,0.1)",
                fontSize: "0.8rem",
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              fill={`url(#grad-${title})`}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function HistoryPage() {
  const { history, activityLog } = useSim();
  const [range, setRange] = useState(1440);

  const weightData = useMemo(() => filterByRange(history.weight, range), [history.weight, range]);
  const fillData = useMemo(() => filterByRange(history.fill, range), [history.fill, range]);
  const aqiData = useMemo(() => filterByRange(history.aqi, range), [history.aqi, range]);
  const tempData = useMemo(() => filterByRange(history.temp, range), [history.temp, range]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-2xl font-bold">Sensor History</h2>
        <div className="flex gap-2">
          {ranges.map((r) => (
            <Chip
              key={r.minutes}
              label={r.label}
              active={range === r.minutes}
              onClick={() => setRange(r.minutes)}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <ChartCard title="Weight (kg)" data={weightData} yDomain={[0, 6]} />
        <ChartCard title="Fill Level (%)" data={fillData} yDomain={[0, 100]} />
        <ChartCard
          title="Air Quality (AQI)"
          data={aqiData}
          yDomain={[0, 300]}
          zones={[
            { y1: 0, y2: 80, fill: "rgba(58,110,52,0.06)" },
            { y1: 80, y2: 150, fill: "rgba(138,108,0,0.06)" },
            { y1: 150, y2: 300, fill: "rgba(158,59,47,0.06)" },
          ]}
        />
        <ChartCard
          title="Temperature (°C)"
          data={tempData}
          yDomain={[15, 35]}
        />
      </div>

      {/* Activity Log */}
      <div className="bg-surface-low rounded-[2rem] p-8">
        <h3 className="font-display font-bold mb-5">Activity Log</h3>
        <div className="max-h-[300px] overflow-y-auto space-y-3">
          {activityLog.slice(0, 30).map((a, i) => (
            <div key={i} className="flex gap-3 items-start text-sm">
              <span
                className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                style={{ background: activityColors[a.type] || "#715800" }}
              />
              <span className="text-on-surface-variant text-xs whitespace-nowrap min-w-[60px]">
                {new Date(a.time).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <span>{a.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

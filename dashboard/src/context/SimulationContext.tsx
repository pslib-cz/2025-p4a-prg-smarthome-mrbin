"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";

/* ========== Types ========== */
export interface SensorData {
  weight: number;
  fillLevel: number;
  fillCm: number;
  aqi: number;
  temperature: number;
  lastInteraction: number;
  lidOpen: boolean;
  freshenerOn: boolean;
}

export interface HistoryPoint {
  t: number;
  v: number;
}

export interface Notification {
  id: number;
  type: "info" | "warn" | "alert" | "success";
  title: string;
  body: string;
  timestamp: number;
  read: boolean;
}

export interface FriendMessage {
  text: string;
  time: number;
}

export interface ActivityEntry {
  type: "info" | "warn" | "alert" | "success";
  text: string;
  time: number;
}

export interface Controls {
  freshenerPower: boolean;
  freshenerMode: "auto" | "manual";
  freshenerIntensity: number;
  selectedSound: string;
  volume: number;
  servoAngle: number;
  displayPower: boolean;
  displayMode: "stats" | "face" | "clock";
  brightness: number;
}

export interface Settings {
  fillThreshold: number;
  weightThreshold: number;
  aqiThreshold: number;
  inactivityHours: number;
  friendMessages: boolean;
  soundAlerts: boolean;
  pushNotifications: boolean;
}

interface SimContextType {
  sensors: SensorData;
  history: { weight: HistoryPoint[]; fill: HistoryPoint[]; aqi: HistoryPoint[]; temp: HistoryPoint[] };
  notifications: Notification[];
  friendMsgs: FriendMessage[];
  activityLog: ActivityEntry[];
  controls: Controls;
  settings: Settings;
  toasts: { id: number; msg: string }[];
  setControls: React.Dispatch<React.SetStateAction<Controls>>;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  setSensors: React.Dispatch<React.SetStateAction<SensorData>>;
  addNotification: (type: Notification["type"], title: string, body: string) => void;
  addFriendMessage: (text: string) => void;
  addActivity: (type: ActivityEntry["type"], text: string) => void;
  clearNotifications: () => void;
  markAllRead: () => void;
  showToast: (msg: string) => void;
  touchInteraction: () => void;
}

const SimContext = createContext<SimContextType | null>(null);
export const useSim = () => {
  const ctx = useContext(SimContext);
  if (!ctx) throw new Error("useSim must be inside SimulationProvider");
  return ctx;
};

/* ========== Helpers ========== */
function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

/* ========== Provider ========== */
export function SimulationProvider({ children }: { children: React.ReactNode }) {
  const [sensors, setSensors] = useState<SensorData>({
    weight: 1.2,
    fillLevel: 35,
    fillCm: 19.5,
    aqi: 42,
    temperature: 22.3,
    lastInteraction: Date.now(),
    lidOpen: false,
    freshenerOn: false,
  });

  const [history, setHistory] = useState<{
    weight: HistoryPoint[];
    fill: HistoryPoint[];
    aqi: HistoryPoint[];
    temp: HistoryPoint[];
  }>({ weight: [], fill: [], aqi: [], temp: [] });

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [friendMsgs, setFriendMsgs] = useState<FriendMessage[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityEntry[]>([]);
  const [controls, setControls] = useState<Controls>({
    freshenerPower: false,
    freshenerMode: "auto",
    freshenerIntensity: 50,
    selectedSound: "reminder",
    volume: 70,
    servoAngle: 0,
    displayPower: true,
    displayMode: "stats",
    brightness: 80,
  });

  const [settings, setSettings] = useState<Settings>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("mrbin_settings");
      if (saved) {
        try { return JSON.parse(saved); } catch { /* use default */ }
      }
    }
    return {
      fillThreshold: 80,
      weightThreshold: 4.5,
      aqiThreshold: 150,
      inactivityHours: 6,
      friendMessages: true,
      soundAlerts: true,
      pushNotifications: false,
    };
  });

  const [toasts, setToasts] = useState<{ id: number; msg: string }[]>([]);

  // Persist settings
  useEffect(() => {
    localStorage.setItem("mrbin_settings", JSON.stringify(settings));
  }, [settings]);

  const sensorsRef = useRef(sensors);
  sensorsRef.current = sensors;
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  const showToast = useCallback((msg: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2200);
  }, []);

  const addNotification = useCallback(
    (type: Notification["type"], title: string, body: string) => {
      setNotifications((prev) => {
        const next = [{ id: Date.now() + Math.random(), type, title, body, timestamp: Date.now(), read: false }, ...prev];
        return next.slice(0, 50);
      });
    },
    []
  );

  const addFriendMessage = useCallback((text: string) => {
    setFriendMsgs((prev) => [{ text, time: Date.now() }, ...prev].slice(0, 5));
  }, []);

  const addActivity = useCallback((type: ActivityEntry["type"], text: string) => {
    setActivityLog((prev) => [{ type, text, time: Date.now() }, ...prev].slice(0, 100));
  }, []);

  const clearNotifications = useCallback(() => setNotifications([]), []);
  const markAllRead = useCallback(
    () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true }))),
    []
  );
  const touchInteraction = useCallback(
    () => setSensors((s) => ({ ...s, lastInteraction: Date.now() })),
    []
  );

  // Seed history on mount
  useEffect(() => {
    const now = Date.now();
    const w: HistoryPoint[] = [];
    const f: HistoryPoint[] = [];
    const a: HistoryPoint[] = [];
    const tp: HistoryPoint[] = [];
    for (let i = 200; i >= 0; i--) {
      const t = now - i * 5 * 60000;
      w.push({ t, v: 1.2 + Math.sin(i * 0.05) * 0.5 + Math.random() * 0.2 });
      f.push({ t, v: clamp(30 + i * 0.15 + Math.random() * 3, 0, 100) });
      a.push({ t, v: 40 + Math.sin(i * 0.08) * 30 + Math.random() * 15 });
      tp.push({ t, v: 22 + Math.sin(i * 0.03) * 2 + Math.random() * 0.5 });
    }
    setHistory({ weight: w, fill: f, aqi: a, temp: tp });

    setFriendMsgs([
      { text: "Hey there! I'm your MRBin. I'm feeling great today!", time: now - 10 * 60000 },
      { text: "I'm about a third full. No rush, but keep an eye on me.", time: now - 5 * 60000 },
    ]);
    setActivityLog([
      { type: "info", text: "All sensors initialized", time: now - 1000 },
      { type: "success", text: "Connected to ESP32 (simulated)", time: now - 2000 },
      { type: "info", text: "System started", time: now - 3000 },
    ]);
  }, []);

  // Simulation tick
  useEffect(() => {
    const interval = setInterval(() => {
      setSensors((s) => {
        const weight = clamp(s.weight + (Math.random() - 0.48) * 0.1, 0.1, 6);
        const fillLevel = clamp(s.fillLevel + (Math.random() - 0.3) * 0.5, 0, 100);
        const aqi = clamp(s.aqi + (Math.random() - 0.5) * 5, 10, 350);
        const temperature = clamp(s.temperature + (Math.random() - 0.5) * 0.2, 16, 32);
        const fillCm = +((100 - fillLevel) / 100 * 30).toFixed(1);
        return { ...s, weight, fillLevel, fillCm, aqi, temperature };
      });

      setHistory((h) => {
        const now = Date.now();
        const s = sensorsRef.current;
        const cap = (arr: HistoryPoint[], v: number) => {
          const next = [...arr, { t: now, v }];
          return next.length > 500 ? next.slice(-500) : next;
        };
        return {
          weight: cap(h.weight, s.weight),
          fill: cap(h.fill, s.fillLevel),
          aqi: cap(h.aqi, s.aqi),
          temp: cap(h.temp, s.temperature),
        };
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Notification generator
  useEffect(() => {
    const interval = setInterval(() => {
      const s = sensorsRef.current;
      const st = settingsRef.current;
      if (!st.friendMessages) return;
      const r = Math.random();
      if (s.fillLevel > st.fillThreshold && r < 0.3) {
        addNotification("warn", "Getting Full!", `Fill level is at ${Math.round(s.fillLevel)}%. Time to take me out!`);
        addFriendMessage(`Hey! I'm ${Math.round(s.fillLevel)}% full. Maybe time for a trip outside?`);
        addActivity("warn", `Fill level alert: ${Math.round(s.fillLevel)}%`);
      } else if (s.aqi > st.aqiThreshold && r < 0.3) {
        addNotification("alert", "Smell Detected", `Air quality is ${Math.round(s.aqi)} AQI. I've sprayed some freshener!`);
        addFriendMessage("Something smells off... I've activated the air freshener for you!");
        setSensors((prev) => ({ ...prev, freshenerOn: true }));
        addActivity("alert", `AQI alert: ${Math.round(s.aqi)}`);
      } else if (r < 0.05) {
        const idle = Date.now() - s.lastInteraction;
        if (idle > st.inactivityHours * 3600000) {
          addNotification("info", "Miss You!", "It's been a while since you checked on me.");
          addFriendMessage("It's been a while since you last visited. I hope you're doing well!");
        }
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [addNotification, addFriendMessage, addActivity]);

  return (
    <SimContext.Provider
      value={{
        sensors,
        history,
        notifications,
        friendMsgs,
        activityLog,
        controls,
        settings,
        toasts,
        setControls,
        setSettings,
        setSensors,
        addNotification,
        addFriendMessage,
        addActivity,
        clearNotifications,
        markAllRead,
        showToast,
        touchInteraction,
      }}
    >
      {children}
    </SimContext.Provider>
  );
}

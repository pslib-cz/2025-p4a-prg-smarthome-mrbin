"use client";

import { useState } from "react";
import { useSim } from "@/context/SimulationContext";
import Toggle from "@/components/Toggle";
import Chip from "@/components/Chip";

export default function SettingsPage() {
  const { settings, setSettings, showToast } = useSim();
  const [espIp, setEspIp] = useState("192.168.1.100");
  const [espPort, setEspPort] = useState("6053");
  const [mqtt, setMqtt] = useState("");
  const [connStatus, setConnStatus] = useState("Status: Simulated Mode");

  function testConnection() {
    setConnStatus("Status: Testing...");
    setTimeout(() => {
      setConnStatus("Status: Simulated Mode (no ESP32 detected)");
      showToast("Connection test complete (simulated)");
    }, 1500);
  }

  function resetAll() {
    localStorage.removeItem("mrbin_settings");
    showToast("Settings reset to defaults");
    window.location.reload();
  }

  return (
    <div>
      <h2 className="font-display text-2xl font-bold mb-8">Settings</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Thresholds */}
        <div className="bg-surface-low rounded-[2rem] p-8">
          <h3 className="font-display text-lg font-bold mb-8">
            Alert Thresholds
          </h3>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-1">
              <div>
                <div className="text-sm font-medium">Fill Level Alert</div>
                <div className="text-xs text-on-surface-variant">
                  Trigger when fill exceeds this
                </div>
              </div>
              <span className="font-display font-bold text-sm text-primary">
                {settings.fillThreshold}%
              </span>
            </div>
            <input
              type="range"
              min={50}
              max={100}
              value={settings.fillThreshold}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  fillThreshold: +e.target.value,
                }))
              }
            />
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-1">
              <div>
                <div className="text-sm font-medium">Weight Alert</div>
                <div className="text-xs text-on-surface-variant">
                  Maximum weight before alert
                </div>
              </div>
              <span className="font-display font-bold text-sm text-primary">
                {settings.weightThreshold} kg
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              step={0.5}
              value={settings.weightThreshold}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  weightThreshold: +e.target.value,
                }))
              }
            />
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-1">
              <div>
                <div className="text-sm font-medium">Air Quality Alert</div>
                <div className="text-xs text-on-surface-variant">
                  AQI threshold for smell warning
                </div>
              </div>
              <span className="font-display font-bold text-sm text-primary">
                {settings.aqiThreshold}
              </span>
            </div>
            <input
              type="range"
              min={50}
              max={300}
              value={settings.aqiThreshold}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  aqiThreshold: +e.target.value,
                }))
              }
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-sm font-medium">Inactivity Timeout</div>
                <div className="text-xs text-on-surface-variant">
                  Alert if no interaction for this long
                </div>
              </div>
              <span className="font-display font-bold text-sm text-primary">
                {settings.inactivityHours}h
              </span>
            </div>
            <div className="flex gap-2 mt-2">
              {[1, 2, 6, 12, 24].map((h) => (
                <Chip
                  key={h}
                  label={`${h}h`}
                  active={settings.inactivityHours === h}
                  onClick={() =>
                    setSettings((s) => ({ ...s, inactivityHours: h }))
                  }
                />
              ))}
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-surface-low rounded-[2rem] p-8">
          <h3 className="font-display text-lg font-bold mb-8">
            Notifications
          </h3>

          <div className="flex items-center justify-between py-3">
            <div className="flex-1 mr-4">
              <div className="text-sm font-medium">Friend Messages</div>
              <div className="text-xs text-on-surface-variant">
                Enable personality messages from your bin
              </div>
            </div>
            <Toggle
              checked={settings.friendMessages}
              onChange={(v) =>
                setSettings((s) => ({ ...s, friendMessages: v }))
              }
            />
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex-1 mr-4">
              <div className="text-sm font-medium">Sound Alerts</div>
              <div className="text-xs text-on-surface-variant">
                Play audio for critical alerts
              </div>
            </div>
            <Toggle
              checked={settings.soundAlerts}
              onChange={(v) =>
                setSettings((s) => ({ ...s, soundAlerts: v }))
              }
            />
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex-1 mr-4">
              <div className="text-sm font-medium">Push Notifications</div>
              <div className="text-xs text-on-surface-variant">
                Browser push for alerts
              </div>
            </div>
            <Toggle
              checked={settings.pushNotifications}
              onChange={(v) =>
                setSettings((s) => ({ ...s, pushNotifications: v }))
              }
            />
          </div>
        </div>

        {/* Connection */}
        <div className="bg-surface-low rounded-[2rem] p-8">
          <h3 className="font-display text-lg font-bold mb-8">Connection</h3>

          <div className="mb-5 text-left">
            <label className="block text-xs font-medium text-on-surface-variant uppercase tracking-wider mb-2">
              ESP32 IP Address
            </label>
            <input
              type="text"
              value={espIp}
              onChange={(e) => setEspIp(e.target.value)}
              className="w-full px-5 py-3 bg-surface-container rounded-[1.5rem] text-sm outline-none focus:bg-surface-high transition-colors"
              placeholder="192.168.1.100"
            />
          </div>

          <div className="mb-5 text-left">
            <label className="block text-xs font-medium text-on-surface-variant uppercase tracking-wider mb-2">
              ESPHome API Port
            </label>
            <input
              type="text"
              value={espPort}
              onChange={(e) => setEspPort(e.target.value)}
              className="w-full px-5 py-3 bg-surface-container rounded-[1.5rem] text-sm outline-none focus:bg-surface-high transition-colors"
              placeholder="6053"
            />
          </div>

          <div className="mb-5 text-left">
            <label className="block text-xs font-medium text-on-surface-variant uppercase tracking-wider mb-2">
              MQTT Broker (optional)
            </label>
            <input
              type="text"
              value={mqtt}
              onChange={(e) => setMqtt(e.target.value)}
              className="w-full px-5 py-3 bg-surface-container rounded-[1.5rem] text-sm outline-none focus:bg-surface-high transition-colors"
              placeholder="mqtt://broker:1883"
            />
          </div>

          <button
            onClick={testConnection}
            className="w-full py-3 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-full font-semibold text-sm shadow-[0_4px_20px_rgba(113,88,0,0.2)] hover:opacity-90 transition-opacity"
          >
            Test Connection
          </button>
          <p className="text-xs text-on-surface-variant text-center mt-3">
            {connStatus}
          </p>
        </div>

        {/* About */}
        <div className="bg-surface-low rounded-[2rem] p-8">
          <h3 className="font-display text-lg font-bold mb-8">About MRBin</h3>

          <div className="flex items-center justify-between py-2">
            <span className="text-sm font-medium">Version</span>
            <span className="text-sm">1.0.0-prototype</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm font-medium">Controller</span>
            <span className="text-sm">ESP32 + ESPHome</span>
          </div>

          <div className="mt-5">
            <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wider mb-2">
              Sensors
            </p>
            <div className="space-y-1 text-sm text-on-surface-variant">
              <p>HX711 Load Cell (Weight)</p>
              <p>MQ135 Gas Sensor (Air Quality)</p>
              <p>JSN-SR04T Ultrasonic (Fill Level)</p>
              <p>Touchscreen Display</p>
              <p>Servo Motor (Lid)</p>
              <p>Atomizer (Air Freshener)</p>
              <p>Audio Reproductor</p>
            </div>
          </div>

          <button
            onClick={resetAll}
            className="w-full mt-8 py-3 bg-surface-highest text-on-surface rounded-full font-medium text-sm hover:bg-surface-high transition-colors"
          >
            Reset All Settings
          </button>
        </div>
      </div>
    </div>
  );
}

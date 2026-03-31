"use client";

import { useSim } from "@/context/SimulationContext";
import Toggle from "@/components/Toggle";
import Chip from "@/components/Chip";
import { SprayCan, Volume2, Package, Monitor } from "lucide-react";

const sounds = [
  { id: "reminder", label: "Reminder Chime" },
  { id: "thankyou", label: "Thank You" },
  { id: "alert", label: "Alert Tone" },
  { id: "melody", label: "Friendly Melody" },
];

export default function ControlsPage() {
  const {
    controls,
    setControls,
    sensors,
    setSensors,
    showToast,
    addActivity,
    touchInteraction,
  } = useSim();

  return (
    <div>
      <h2 className="font-display text-2xl font-bold mb-8">Manual Controls</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Air Freshener */}
        <div className="bg-surface-low rounded-[2rem] p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center">
                <SprayCan size={20} className="text-primary" />
              </div>
              <div>
                <div className="font-display font-bold">Air Freshener</div>
                <div className="text-[0.7rem] text-on-surface-variant">
                  Servo + Atomizer
                </div>
              </div>
            </div>
            <span
              className="w-2 h-2 rounded-full bg-warning"
              title="Simulated"
            />
          </div>

          <div className="flex items-center justify-between mb-5">
            <span className="text-sm">Power</span>
            <Toggle
              checked={controls.freshenerPower}
              onChange={(v) => {
                setControls((c) => ({ ...c, freshenerPower: v }));
                setSensors((s) => ({ ...s, freshenerOn: v }));
                showToast(v ? "Air freshener activated" : "Air freshener off");
                addActivity(v ? "success" : "info", `Air freshener ${v ? "ON" : "OFF"}`);
                touchInteraction();
              }}
            />
          </div>

          <div className="flex items-center justify-between mb-5">
            <span className="text-sm">Mode</span>
            <div className="flex gap-2">
              {(["auto", "manual"] as const).map((m) => (
                <Chip
                  key={m}
                  label={m.charAt(0).toUpperCase() + m.slice(1)}
                  active={controls.freshenerMode === m}
                  onClick={() => {
                    setControls((c) => ({ ...c, freshenerMode: m }));
                    showToast(`Mode: ${m}`);
                    touchInteraction();
                  }}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm">Intensity</span>
              <span className="font-display font-bold text-sm text-primary">
                {controls.freshenerIntensity}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={controls.freshenerIntensity}
              onChange={(e) =>
                setControls((c) => ({
                  ...c,
                  freshenerIntensity: +e.target.value,
                }))
              }
            />
          </div>
          <p className="text-[0.7rem] text-on-surface-variant mt-3">
            Last spray: --
          </p>
        </div>

        {/* Sound Player */}
        <div className="bg-surface-low rounded-[2rem] p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center">
                <Volume2 size={20} className="text-primary" />
              </div>
              <div>
                <div className="font-display font-bold">Sound Player</div>
                <div className="text-[0.7rem] text-on-surface-variant">
                  Reproductor
                </div>
              </div>
            </div>
            <span
              className="w-2 h-2 rounded-full bg-warning"
              title="Simulated"
            />
          </div>

          <div className="space-y-2 mb-5">
            {sounds.map((s) => (
              <button
                key={s.id}
                onClick={() =>
                  setControls((c) => ({ ...c, selectedSound: s.id }))
                }
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-[1.5rem] text-sm transition-colors ${
                  controls.selectedSound === s.id
                    ? "bg-surface-lowest font-semibold"
                    : "hover:bg-surface-container"
                }`}
              >
                <span className="w-7 h-7 rounded-full bg-primary-container flex items-center justify-center shrink-0">
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </span>
                {s.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between mb-1">
            <span className="text-sm">Volume</span>
            <span className="font-display font-bold text-sm text-primary">
              {controls.volume}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={controls.volume}
            onChange={(e) =>
              setControls((c) => ({ ...c, volume: +e.target.value }))
            }
          />

          <div className="flex gap-2 mt-5">
            <button
              onClick={() => {
                showToast(`Playing: ${controls.selectedSound}`);
                addActivity("info", `Sound played: ${controls.selectedSound}`);
                touchInteraction();
              }}
              className="flex-1 py-3 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-full font-semibold text-sm shadow-[0_4px_20px_rgba(113,88,0,0.2)] hover:opacity-90 transition-opacity"
            >
              Play Sound
            </button>
            <button
              onClick={() => {
                showToast("Speaker test...");
                addActivity("info", "Speaker test executed");
                touchInteraction();
              }}
              className="px-5 py-3 bg-surface-highest text-on-surface rounded-full font-medium text-sm hover:bg-surface-high transition-colors"
            >
              Test
            </button>
          </div>
        </div>

        {/* Lid / Servo Control */}
        <div className="bg-surface-low rounded-[2rem] p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center">
                <Package size={20} className="text-primary" />
              </div>
              <div>
                <div className="font-display font-bold">Lid Control</div>
                <div className="text-[0.7rem] text-on-surface-variant">
                  Servo Motor
                </div>
              </div>
            </div>
            <span
              className="w-2 h-2 rounded-full bg-warning"
              title="Simulated"
            />
          </div>

          <div className="flex items-center justify-between mb-5">
            <span className="text-sm">Lid Position</span>
            <div className="flex gap-2">
              {(["closed", "open"] as const).map((pos) => (
                <Chip
                  key={pos}
                  label={pos.charAt(0).toUpperCase() + pos.slice(1)}
                  active={
                    pos === "open" ? sensors.lidOpen : !sensors.lidOpen
                  }
                  onClick={() => {
                    const angle = pos === "open" ? 90 : 0;
                    setSensors((s) => ({
                      ...s,
                      lidOpen: pos === "open",
                    }));
                    setControls((c) => ({ ...c, servoAngle: angle }));
                    showToast(`Lid ${pos}`);
                    addActivity("info", `Lid ${pos}`);
                    touchInteraction();
                  }}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm">Servo Angle</span>
              <span className="font-display font-bold text-sm text-primary">
                {controls.servoAngle}°
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={180}
              value={controls.servoAngle}
              onChange={(e) => {
                const angle = +e.target.value;
                setControls((c) => ({ ...c, servoAngle: angle }));
                setSensors((s) => ({ ...s, lidOpen: angle > 45 }));
              }}
            />
          </div>

          <button
            onClick={() => {
              setControls((c) => ({ ...c, servoAngle: 0 }));
              setSensors((s) => ({ ...s, lidOpen: false }));
              showToast("Servo returned to home");
              addActivity("info", "Servo homed to 0°");
              touchInteraction();
            }}
            className="w-full mt-5 py-3 bg-surface-highest text-on-surface rounded-full font-medium text-sm hover:bg-surface-high transition-colors"
          >
            Return to Home (0°)
          </button>
          <p className="text-[0.7rem] text-on-surface-variant mt-3">
            Current: <strong>{controls.servoAngle}°</strong>
          </p>
        </div>

        {/* Touchscreen / Display */}
        <div className="bg-surface-low rounded-[2rem] p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center">
                <Monitor size={20} className="text-primary" />
              </div>
              <div>
                <div className="font-display font-bold">Touchscreen</div>
                <div className="text-[0.7rem] text-on-surface-variant">
                  Display Module
                </div>
              </div>
            </div>
            <span
              className="w-2 h-2 rounded-full bg-warning"
              title="Simulated"
            />
          </div>

          <div className="flex items-center justify-between mb-5">
            <span className="text-sm">Display Power</span>
            <Toggle
              checked={controls.displayPower}
              onChange={(v) => {
                setControls((c) => ({ ...c, displayPower: v }));
                showToast(v ? "Display ON" : "Display OFF");
                touchInteraction();
              }}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm">Brightness</span>
              <span className="font-display font-bold text-sm text-primary">
                {controls.brightness}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={controls.brightness}
              onChange={(e) =>
                setControls((c) => ({ ...c, brightness: +e.target.value }))
              }
            />
          </div>

          <div className="flex items-center justify-between mt-5">
            <span className="text-sm">Show Mode</span>
            <div className="flex gap-2">
              {(["stats", "face", "clock"] as const).map((m) => (
                <Chip
                  key={m}
                  label={m.charAt(0).toUpperCase() + m.slice(1)}
                  active={controls.displayMode === m}
                  onClick={() => {
                    setControls((c) => ({ ...c, displayMode: m }));
                    showToast(`Display mode: ${m}`);
                    touchInteraction();
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

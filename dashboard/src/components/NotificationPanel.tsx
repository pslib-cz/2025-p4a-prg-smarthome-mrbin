"use client";

import { useSim } from "@/context/SimulationContext";
import { timeAgo } from "@/lib/utils";

const icons: Record<string, string> = {
  info: "\u2139\uFE0F",
  warn: "\u26A0\uFE0F",
  alert: "\uD83D\uDEA8",
  success: "\u2705",
};

const iconBg: Record<string, string> = {
  info: "bg-surface-container",
  warn: "bg-warning-bg",
  alert: "bg-danger-bg",
  success: "bg-success-bg",
};

export default function NotificationPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { notifications, clearNotifications, markAllRead } = useSim();

  // Mark read when opening
  if (open) {
    markAllRead();
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/10 z-[199]"
          onClick={onClose}
        />
      )}
      <div
        className={`fixed top-0 right-0 bottom-0 w-[380px] max-w-full bg-white/88 backdrop-blur-[30px] shadow-[-8px_0_60px_rgba(46,47,45,0.12)] z-[200] transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] p-8 flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-xl font-bold">Notifications</h2>
          <button
            onClick={clearNotifications}
            className="px-4 py-2 bg-surface-highest text-on-surface rounded-full text-[0.85rem] font-medium hover:bg-surface-high transition-colors"
          >
            Clear All
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-8">
          {notifications.length === 0 ? (
            <p className="text-center text-on-surface-variant py-16 text-[0.9rem]">
              No notifications yet
            </p>
          ) : (
            notifications.map((n) => (
              <div key={n.id} className="flex gap-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0 ${iconBg[n.type]}`}
                >
                  {icons[n.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[0.85rem]">{n.title}</div>
                  <div className="text-[0.8rem] text-on-surface-variant leading-snug">
                    {n.body}
                  </div>
                  <div className="text-[0.7rem] text-on-surface-variant mt-1">
                    {timeAgo(n.timestamp)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

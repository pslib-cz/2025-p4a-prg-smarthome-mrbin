"use client";

import { useSim } from "@/context/SimulationContext";

export default function Toasts() {
  const { toasts } = useSim();

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[300] flex flex-col gap-2 items-center pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="px-6 py-3 bg-on-surface text-bg rounded-full text-[0.85rem] font-medium shadow-[0_4px_20px_rgba(46,47,45,0.12)] toast-animate"
        >
          {t.msg}
        </div>
      ))}
    </div>
  );
}

"use client";

export default function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
        active
          ? "bg-primary-container text-primary font-semibold"
          : "bg-secondary-container text-on-surface hover:bg-surface-high"
      }`}
    >
      {label}
    </button>
  );
}

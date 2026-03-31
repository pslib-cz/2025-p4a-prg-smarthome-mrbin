"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useSim } from "@/context/SimulationContext";
import {
  LayoutGrid,
  SlidersHorizontal,
  Activity,
  Settings,
  Bell,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutGrid },
  { href: "/controls", label: "Controls", icon: SlidersHorizontal },
  { href: "/history", label: "History", icon: Activity },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({
  onNotifToggle,
  mobileOpen,
  onClose,
}: {
  onNotifToggle: () => void;
  mobileOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const { notifications } = useSim();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/10 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      <nav
        className={`fixed top-0 left-0 bottom-0 w-[240px] bg-surface-low p-8 pr-5 flex flex-col z-50 transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="font-display text-2xl font-extrabold bg-gradient-to-br from-primary to-primary-container bg-clip-text text-transparent mb-12 px-3">
          MRBin
        </div>

        <ul className="flex-1 space-y-1">
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-3 rounded-[1.5rem] text-[0.9rem] font-medium transition-all ${
                    active
                      ? "bg-primary-container text-primary font-semibold"
                      : "text-on-surface-variant hover:bg-surface-high hover:text-on-surface"
                  }`}
                >
                  <item.icon size={20} />
                  {item.label}
                </Link>
              </li>
            );
          })}
          <li>
            <button
              onClick={() => {
                onClose();
                onNotifToggle();
              }}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-[1.5rem] text-[0.9rem] font-medium text-on-surface-variant hover:bg-surface-high hover:text-on-surface transition-all"
            >
              <Bell size={20} />
              Notifications
              {unread > 0 && (
                <span className="ml-auto bg-danger text-white text-[0.65rem] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
                  {unread}
                </span>
              )}
            </button>
          </li>
        </ul>

        <div className="pt-4">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-[1.5rem] text-[0.9rem] font-medium text-on-surface-variant hover:bg-surface-high hover:text-on-surface transition-all"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </nav>
    </>
  );
}

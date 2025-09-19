"use client";
import * as React from "react";
import { X } from "lucide-react";

export default function MobileDrawer({
  open,
  onClose,
  children,
  title = "Menu",
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}) {
  React.useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/60 transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />
      {/* Sheet */}
      <aside
        role="dialog"
        aria-modal="true"
        className={`fixed left-0 top-0 z-[61] h-full w-[86%] max-w-sm transform bg-[#0B130B] text-white shadow-2xl transition-transform ease-out
        ${open ? "translate-x-0" : "-translate-x-full"}`}
        style={{ borderRight: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div className="text-sm font-medium opacity-80">{title}</div>
          <button
            aria-label="Close menu"
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-3">{children}</div>
      </aside>
    </>
  );
}

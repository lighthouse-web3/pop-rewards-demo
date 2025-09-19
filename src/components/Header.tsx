"use client";

import { useRouter, usePathname } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { COLORS } from "@/lib/colors";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import MobileDrawer from "@/components/MobileDrawer";
import {
  Menu,
  Gift,
  LogIn,
  LogOut,
  LayoutGrid,
  Trophy,
  Route,
  Plug2,
  Plus,
} from "lucide-react";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { ready, authenticated, login, logout } = usePrivy();
  const [open, setOpen] = useState(false);

  const authed = ready && authenticated;

  useEffect(() => {
    if (authed && pathname !== "/dashboard") {
      router.replace("/dashboard");
    }
  }, [authed, pathname, router]);

  const handleLogin = async () => {
    await login();
  };

  const handleLogout = async () => {
    await logout();
    if (pathname !== "/") router.push("/");
  };

  const NavButton = ({
    href,
    children,
    icon,
    requiresAuth = false,
  }: {
    href: string;
    children: React.ReactNode;
    icon: React.ReactNode;
    requiresAuth?: boolean;
  }) => (
    <Link
      href={href}
      onClick={(e) => {
        // if this route needs auth and user isn't authed, open login instead
        if (requiresAuth && !authed) {
          e.preventDefault();
          setOpen(false);
          handleLogin();
          return;
        }
        setOpen(false);
      }}
      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
        pathname === href ? "bg-white/10" : "hover:bg-white/5"
      }`}
    >
      <span className="opacity-90">{icon}</span>
      <span>{children}</span>
    </Link>
  );

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-40 border-b border-white/10 backdrop-blur-md"
        style={{ backgroundColor: "rgba(11,15,9,0.60)" }}
      >
        <div className="mx-auto max-w-8xl px-4 md:px-6">
          <div className="flex h-14 md:h-16 items-center justify-between">
            {/* Left: logo + hamburger */}
            <div className="flex items-center justify-between w-full gap-3">
              <Link href={"/"} className="flex items-center gap-3">
                <Image
                  src={"/logo.png"}
                  alt="Logo"
                  width={28}
                  height={28}
                  className="rounded-xl"
                />
                <span className="text-lg font-semibold tracking-tight">
                  pop.rewards
                </span>
              </Link>
              <button
                className="mr-1 rounded-lg p-2 hover:bg-white/10 md:hidden"
                aria-label="Open menu"
                onClick={() => setOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>

            {/* Right: actions (hidden on mobile) */}
            <div className="hidden items-center gap-2 md:flex">
              {!ready ? null : authed ? (
                <>
                  <button
                    onClick={() => router.push("/dashboard")}
                    className="inline-flex h-9 items-center rounded-full border border-white/15 px-3 text-sm text-white hover:bg-white/10"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="inline-flex h-9 items-center rounded-full border border-white/15 px-3 text-sm text-white hover:bg-white/10"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleLogin}
                    className="inline-flex h-9 items-center rounded-full px-3.5 text-sm font-medium text-black shadow-sm"
                    style={{
                      background: `linear-gradient(90deg, ${COLORS.yellowFrom}, ${COLORS.yellowTo})`,
                    }}
                  >
                    $POP Airdrop
                  </button>
                  <button
                    onClick={handleLogin}
                    className="inline-flex h-9 items-center rounded-full border border-white/15 px-4 text-sm text-white hover:bg-white/10"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      <div className="h-14 md:h-16" />

      {/* Mobile drawer */}
      <MobileDrawer open={open} onClose={() => setOpen(false)}>
        {/* Only show dashboard nav + Add Data when authenticated */}
        {authed && (
          <>
            <nav className="grid gap-1">
              <NavButton
                href="/dashboard"
                icon={<LayoutGrid className="h-4 w-4" />}
                requiresAuth
              >
                Overview
              </NavButton>
              <NavButton
                href="/dashboard/leaderboard"
                icon={<Trophy className="h-4 w-4" />}
                requiresAuth
              >
                Leaderboard
              </NavButton>
              <NavButton
                href="/dashboard/journey"
                icon={<Route className="h-4 w-4" />}
                requiresAuth
              >
                Journey
              </NavButton>
              <NavButton
                href="/dashboard/connected"
                icon={<Plug2 className="h-4 w-4" />}
                requiresAuth
              >
                Connected Data
              </NavButton>
            </nav>

            <div className="my-4 h-px bg-white/10" />

            <button
              onClick={() => {
                setOpen(false);
                document
                  .getElementById("connect-data-modal")
                  ?.dispatchEvent(new CustomEvent("open"));
              }}
              className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 font-medium text-black"
              style={{
                background: `linear-gradient(90deg, ${COLORS.yellowFrom}, ${COLORS.yellowTo})`,
                color: "#061106",
              }}
            >
              <Plus className="h-5 w-5" /> Add Data
            </button>

            <div className="my-4 h-px bg-white/10" />
          </>
        )}

        {/* Secondary actions always visible */}
        <div className="grid gap-2">
          <button
            onClick={() => {
              setOpen(false);
              if (!authed) handleLogin();
              else window.location.assign("/airdrop");
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 px-3 py-2 text-sm hover:bg-white/10"
          >
            <Gift className="h-4 w-4" /> $POP Airdrop
          </button>

          {!ready ? null : authed ? (
            <button
              onClick={() => {
                setOpen(false);
                handleLogout();
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 px-3 py-2 text-sm hover:bg-white/10"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          ) : (
            <button
              onClick={() => {
                setOpen(false);
                handleLogin();
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 px-3 py-2 text-sm hover:bg-white/10"
            >
              <LogIn className="h-4 w-4" /> Sign Up
            </button>
          )}
        </div>
      </MobileDrawer>
    </>
  );
}

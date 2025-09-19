"use client";

import { useRouter, usePathname } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { COLORS } from "@/lib/colors"; // or inline your colors
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { ready, authenticated, login, logout } = usePrivy();

  useEffect(() => {
    if (ready && authenticated && pathname !== "/dashboard") {
      router.replace("/dashboard");
    }
  }, [ready, authenticated, pathname, router]);

  const handleLogin = async () => {
    await login(); // opens Privy modal with external wallets
    // redirect is now handled by useEffect
  };

  const handleLogout = async () => {
    await logout();
    if (pathname !== "/") router.push("/");
  };

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-40 border-b border-white/10 backdrop-blur-md"
        // header style
        style={{ backgroundColor: "rgba(11,15,9,0.60)" }}
      >
        <div className="mx-auto max-w-8xl px-4 md:px-6">
          <div className="flex h-14 md:h-16 items-center justify-between">
            <Link href={"/"}>
              <div className="flex items-center gap-3">
                <Image src={"/logo.png"} alt="Logo" width={48} height={24} />
                <span className="text-lg font-semibold tracking-tight">
                  pop.rewards
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-2 md:gap-3">
              {!ready ? null : authenticated ? (
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
    </>
  );
}

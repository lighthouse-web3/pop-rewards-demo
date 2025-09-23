"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import ScrollStyles from "@/components/ScrollStyles";
import BackgroundDecor from "@/components/BackgroundDecor";
import { COLORS } from "@/lib/colors";
import { short } from "@/lib/utils";
import SmallStat from "@/components/ui/SmallStat";
import RequireAuth from "@/components/RequireAuth";
import { usePrivy } from "@privy-io/react-auth";
import { ReclaimProofRequest } from "@reclaimprotocol/js-sdk";

type ProofRecord = {
  id: string;
  address: string;
  username: string;
  cid: string;
  providerId: string;
  createdAt: string;
  points?: number;
};

function fmtDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return iso;
  }
}

export default function DashboardPage() {
  const { user } = usePrivy();
  const address = user?.wallet?.address || "";
  const addr = short(address) || "-";
  const [tab, setTab] = useState<
    "overview" | "journey" | "leaderboard" | "connected"
  >("overview");
  const [proofs, setProofs] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [serverOut, setServerOut] = useState<{
    cid: string;
    record?: any;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [verifiedCount, setVerifiedCount] = useState<number>(0);
  const [myRecords, setMyRecords] = useState<ProofRecord[]>([]);
  const [loadingProofs, setLoadingProofs] = useState(false);

  const fetchMyProofs = async () => {
    if (!address) return;
    try {
      setLoadingProofs(true);
      const res = await fetch("/api/me", { headers: { "x-session": address } });
      const data = await res.json();
      const rows: ProofRecord[] = Array.isArray(data?.records)
        ? data.records
        : [];
      // newest first
      rows.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
      setMyRecords(rows);
      setVerifiedCount(rows.length);
    } catch (e) {
      console.error("Failed to load /api/me:", e);
    } finally {
      setLoadingProofs(false);
    }
  };

  useEffect(() => {
    fetchMyProofs();
  }, [address]);

  function extractUsernameFromProofs(p: any): string {
    try {
      // proof can be an array or single object; context may be stringified JSON
      const ctx = Array.isArray(p)
        ? p?.[0]?.claimData?.context
        : p?.claimData?.context;
      const parsed = typeof ctx === "string" ? JSON.parse(ctx) : ctx;
      return parsed?.extractedParameters?.username ?? "";
    } catch {
      return "";
    }
  }

  const loadMine = async () => {
    const r = await fetch("/api/me", { headers: { "x-session": address } });
    const { records } = await r.json();
    console.log(records);
  };

  const handleVerification = async () => {
    setErrorMsg("");
    setServerOut(null);
    setProofs(null);

    if (!address) {
      setErrorMsg("No wallet address found. Please sign in with Privy first.");
      return;
    }

    try {
      setIsLoading(true);

      const APP_ID = process.env.NEXT_PUBLIC_RECLAIM_APP_ID || "";
      const APP_SECRET = process.env.NEXT_PUBLIC_RECLAIM_APP_SECRET || "";
      const PROVIDER_ID = process.env.NEXT_PUBLIC_RECLAIM_PROVIDER_ID || "";

      if (!APP_ID || !APP_SECRET || !PROVIDER_ID) {
        throw new Error("Reclaim env vars are missing.");
      }

      const reclaim = await ReclaimProofRequest.init(
        APP_ID,
        APP_SECRET,
        PROVIDER_ID
      );

      // Start native/QR flow
      await reclaim.triggerReclaimFlow();

      await new Promise<void>((resolve, reject) => {
        reclaim.startSession({
          onSuccess: async (p: any) => {
            try {
              setProofs(p);

              // Extract a username if present (safe parser)
              const username = extractUsernameFromProofs(p) || "anon";

              // Send to our backend: verify → upload to Lighthouse → store in JSON db
              const res = await fetch("/api/proofs", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "x-session": address, // bind to user wallet
                },
                body: JSON.stringify({ proofs: p, username }),
              });

              const data = await res.json();
              if (!res.ok) throw new Error(data?.error || "Server error");

              setServerOut({ cid: data.cid, record: data.record });
              await fetchMyProofs();
            } catch (err: any) {
              console.error(err);
              setErrorMsg(err?.message || "Failed to save proof");
            } finally {
              setIsLoading(false);
              resolve();
            }
          },
          onError: (err: any) => {
            console.error("Verification failed", err);
            setErrorMsg("Verification failed. Please try again.");
            setIsLoading(false);
            reject(err);
          },
        });
      });
    } catch (error: any) {
      console.error("Error starting verification:", error);
      setErrorMsg(error?.message || "Could not start verification");
      setIsLoading(false);
    }
  };

  return (
    <RequireAuth>
      <ScrollStyles />
      <div
        className="relative min-h-screen w-full overflow-x-hidden text-white"
        style={{
          background: `linear-gradient(180deg, ${COLORS.bgFrom} 0%, ${COLORS.bgVia} 40%, ${COLORS.bgTo} 100%)`,
        }}
      >
        <BackgroundDecor />
        <Header />

        <main className="relative z-10 mx-auto w-full max-w-8xl px-6 pt-8">
          <div className="grid h-[calc(100vh-6rem)] grid-cols-1 gap-6 overflow-hidden md:grid-cols-[260px_1fr]">
            {/* left rail */}
            <aside className="sticky top-20 hidden h-full flex-col gap-4 self-start md:flex">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <nav className="grid gap-1">
                  <SideNavItem
                    active={tab === "overview"}
                    onClick={() => setTab("overview")}
                  >
                    Overview
                  </SideNavItem>
                  <SideNavItem
                    active={tab === "leaderboard"}
                    onClick={() => setTab("leaderboard")}
                  >
                    Leaderboard
                  </SideNavItem>
                  <SideNavItem
                    active={tab === "journey"}
                    onClick={() => setTab("journey")}
                  >
                    Journey
                  </SideNavItem>
                </nav>
                <button
                  className="mt-3 w-full rounded-xl px-3 py-2 text-sm font-medium text-black"
                  style={{
                    background: `linear-gradient(90deg, ${COLORS.yellowFrom}, ${COLORS.yellowTo})`,
                  }}
                >
                  $POP Airdrop
                </button>
                <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="text-xs text-zinc-300">Wallet</div>
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <code className="rounded bg-black/20 px-2 py-1 text-sm">
                      {addr}
                    </code>
                    <button className="rounded-lg border border-white/10 px-2 py-1 text-xs hover:bg-white/10">
                      Copy
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="mb-2 flex items-center justify-between text-sm font-medium">
                  Connect Data{" "}
                  <span className="text-[10px] text-zinc-400">
                    How POP is computed
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <ConnectTile icon="🧾" title="Orders" />
                  <ConnectTile icon="🎟️" title="Loyalty IDs" />
                  <ConnectTile icon="📦" title="Deliveries" />
                  <ConnectTile icon="🏷️" title="Receipts" />
                </div>
                <button
                  onClick={handleVerification}
                  disabled={isLoading}
                  className="mt-3 w-full rounded-xl border border-white/15 px-3 py-2 text-sm hover:bg-white/10"
                >
                  {isLoading ? "Verifying..." : "Add Data"}
                </button>
                {serverOut && (
                  <div className="mt-3 text-sm text-emerald-300 text-center">
                    <div className="font-medium">
                      Verified ✓ & uploaded to Lighthouse
                    </div>
                    <div className="mt-1 text-zinc-200 break-all">
                      CID: <code className="text-xs">{serverOut.cid}</code>
                    </div>
                    <a
                      href={`https://gateway.lighthouse.storage/ipfs/${serverOut.cid}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-block rounded-lg border border-white/15 px-3 py-1 text-xs text-white hover:bg-white/10"
                    >
                      View JSON ↗
                    </a>
                  </div>
                )}
                {errorMsg && (
                  <div className="mt-3 text-sm text-red-400 text-center">
                    {errorMsg}
                  </div>
                )}
              </div>
            </aside>

            {/* right pane */}
            <section className="themed-scroll grid h-full gap-6 overflow-y-auto pr-1">
              {tab === "overview" && (
                <OverviewPane
                  verifiedCount={verifiedCount}
                  records={myRecords}
                  loadingProofs={loadingProofs}
                />
              )}
              {tab === "journey" && <PlaceholderPane label="Journey" />}
              {tab === "leaderboard" && <JourneyPane />}
            </section>
          </div>
        </main>
      </div>
    </RequireAuth>
  );
}

function SideNavItem({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${
        active ? "bg-white/10" : "hover:bg-white/5"
      }`}
    >
      <span>{children}</span>
      {active && <span className="text-[10px] text-emerald-300">●</span>}
    </button>
  );
}

function ConnectTile({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
      <div className="mb-1 flex items-center justify-center gap-2">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-lg text-black"
          style={{
            background: `linear-gradient(90deg, ${COLORS.yellowFrom}, ${COLORS.yellowTo})`,
          }}
        >
          {icon}
        </div>
      </div>
      <div className="font-medium">{title}</div>
    </div>
  );
}

function OverviewPane({
  verifiedCount,
  records,
  loadingProofs,
}: {
  verifiedCount: number;
  records: ProofRecord[];
  loadingProofs: boolean;
}) {
  return (
    <>
      <header>
        <h1
          className="text-2xl font-semibold"
          style={{ color: COLORS.headline }}
        >
          Welcome Back
        </h1>
        <p className="mt-1 text-sm text-zinc-300">
          Here’s your purchase overview
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SmallStat
          label="Orders (30d)"
          value="0"
          delta="+0% vs last month"
          icon="🛒"
        />
        <SmallStat
          label="Est. Spend (30d)"
          value="$0"
          delta="+0% vs last month"
          icon="💳"
        />
        <SmallStat
          label="Providers Connected"
          value="1"
          delta="+0 new"
          icon="🔌"
        />
        <SmallStat
          label="Proofs Verified"
          value={String(verifiedCount)}
          delta={verifiedCount ? "live from /api/me" : "no proofs yet"}
          icon="✅"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="mb-4 text-lg font-semibold">Activity Score</div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-[200px_1fr]">
            <div className="flex h-40 items-center justify-center rounded-xl border border-white/10 bg-white/5">
              <div className="text-center">
                <div className="text-4xl font-bold">0.00%</div>
                <div className="text-xs text-zinc-400">
                  based on verified orders
                </div>
              </div>
            </div>
            <div>
              <div className="text-sm text-zinc-300">
                No recent proofs. Connect a provider and verify recent orders to
                start earning POP.
              </div>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-200">
                <li>Connect your Amazon account</li>
                <li>Run a Reclaim proof for last 30 days</li>
                <li>Mint POP rewards after verification</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-lg font-semibold">
              Proof Journal
              <span className="text-xs font-normal text-zinc-400">
                {verifiedCount} total
              </span>
            </div>
            <button
              onClick={() => fetch("/api/me", { headers: { "x-session": "" } })}
              className="hidden rounded-lg border border-white/15 px-3 py-1.5 text-xs hover:bg-white/10"
              disabled
              title="future: filter/export"
            >
              Export
            </button>
          </div>

          <p className="mb-3 text-sm text-zinc-300">
            Every verified proof is stored as a compact JSON on Lighthouse.
          </p>

          {/* list (show ~2 rows, scroll the rest) */}
          <div className="themed-scroll h-[148px] overflow-y-auto rounded-xl border border-white/10 bg-black/20">
            {loadingProofs ? (
              <div className="px-4 py-6 text-center text-sm text-zinc-400">
                Loading…
              </div>
            ) : records.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-zinc-400">
                No proofs yet. Add data to get started.
              </div>
            ) : (
              <ul className="divide-y divide-white/10">
                {records.map((r) => (
                  <li
                    key={r.id}
                    className="flex items-center justify-between gap-3 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm">
                        <span className="text-zinc-300">Username:</span>{" "}
                        <span className="font-medium truncate">
                          {r.username || "anon"}
                        </span>
                      </div>
                      <div className="mt-0.5 text-xs text-zinc-400">
                        {fmtDate(r.createdAt)} • Provider:{" "}
                        {r.providerId || "unknown"}
                      </div>
                    </div>
                    <div className="flex flex-none items-center gap-2">
                      {typeof r.points === "number" && (
                        <span className="rounded-md bg-emerald-400/15 px-2 py-1 text-xs text-emerald-300">
                          +{r.points} pts
                        </span>
                      )}
                      <a
                        href={`https://gateway.lighthouse.storage/ipfs/${r.cid}`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-md border border-white/15 px-2 py-1 text-xs hover:bg-white/10"
                        title={r.cid}
                      >
                        View JSON
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="mb-2 text-lg font-semibold">Referral Program</div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-zinc-400">Total Referrals</div>
            <div className="text-2xl font-semibold">0</div>
          </div>
          <div>
            <div className="text-zinc-400">Referral Points</div>
            <div className="text-2xl font-semibold">+0</div>
          </div>
        </div>
        <div className="mt-4 text-sm text-zinc-300">Your referral link</div>
        <div className="mt-2 flex items-center gap-2">
          <input
            className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm"
            readOnly
            value="https://pantrypoints.rewards/app?ref=0x90...132a"
          />
          <button className="rounded-lg border border-white/10 px-3 py-2 text-sm hover:bg-white/10">
            Copy
          </button>
        </div>
        <p className="mt-2 text-xs text-zinc-400">
          Earn 10% of referrals’ points for this epoch.
        </p>
      </div>

      <div className="pb-8" />
    </>
  );
}

function JourneyPane() {
  const [leaders, setLeaders] = useState<{ addr: string; pts: number }[]>([]);
  useEffect(() => {
    const rows = Array.from({ length: 8 }).map(() => {
      const left = Math.floor(Math.random() * 0xffff)
        .toString(16)
        .padStart(4, "0");
      const right = Math.floor(Math.random() * 0xffff)
        .toString(16)
        .padStart(4, "0");
      return {
        addr: `0x${left}…${right}`,
        pts: Math.floor(Math.random() * 100),
      };
    });
    setLeaders(rows);
  }, []);

  return (
    <>
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr]">
        {/* left compare card (same as before) */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-lg font-semibold">Compare Your Spend</div>
            <select className="rounded border border-white/10 bg-black/30 px-2 py-1 text-xs">
              <option>18–30 years</option>
              <option>31–45 years</option>
              <option>All</option>
            </select>
          </div>
          <div className="mt-2 rounded-xl border border-white/10 bg-black/20 p-4">
            <div className="mb-3 text-xs text-zinc-400">
              Your Spend vs. Average
            </div>
            <div className="grid h-40 grid-cols-3 items-end gap-4">
              <div className="flex h-full items-end gap-1">
                <div className="w-1/2 bg-white/20" style={{ height: "20%" }} />
                <div
                  className="w-1/2"
                  style={{
                    height: "30%",
                    background: `linear-gradient(180deg, ${COLORS.yellowFrom}, ${COLORS.yellowTo})`,
                  }}
                />
              </div>
              <div className="flex h-full items-end gap-1">
                <div className="w-1/2 bg-white/20" style={{ height: "40%" }} />
                <div
                  className="w-1/2"
                  style={{
                    height: "80%",
                    background: `linear-gradient(180deg, ${COLORS.yellowFrom}, ${COLORS.yellowTo})`,
                  }}
                />
              </div>
              <div className="flex h-full items-end gap-1">
                <div className="w-1/2 bg-white/20" style={{ height: "30%" }} />
                <div
                  className="w-1/2"
                  style={{
                    height: "25%",
                    background: `linear-gradient(180deg, ${COLORS.yellowFrom}, ${COLORS.yellowTo})`,
                  }}
                />
              </div>
            </div>
            <div className="mt-3 flex justify-center gap-4 text-xs text-zinc-400">
              <span className="inline-block h-3 w-3 bg-white/20" /> Avg
              <span
                className="inline-block h-3 w-3"
                style={{
                  background: `linear-gradient(180deg, ${COLORS.yellowFrom}, ${COLORS.yellowTo})`,
                }}
              />{" "}
              You
            </div>
          </div>
        </div>

        {/* leaderboard */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="mb-2 text-lg font-semibold">WORLDWIDE</div>
          <div className="mb-3 text-xs text-zinc-400">
            Top purchasers by verified orders
          </div>
          <div className="space-y-2 text-sm">
            {leaders.map((row, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 px-3 py-2"
              >
                <div className="flex items-center gap-3">
                  <div className="text-zinc-400">
                    {String(i + 1).padStart(2, "0")}.
                  </div>
                  <div>{row.addr}</div>
                </div>
                <div className="text-emerald-300">{row.pts} pts</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <footer className="pb-8" />
    </>
  );
}

function PlaceholderPane({ label }: { label: string }) {
  return (
    <div className="grid place-items-center py-20">
      <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-8 text-center">
        <div className="text-xl font-semibold">{label}</div>
        <div className="mt-2 text-sm text-zinc-300">
          This section is coming soon.
        </div>
      </div>
    </div>
  );
}

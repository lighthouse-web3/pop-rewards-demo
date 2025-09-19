"use client";

import { useState } from "react";
import { COLORS } from "@/lib/colors";
import Header from "@/components/Header";
import ScrollStyles from "@/components/ScrollStyles";
import BackgroundDecor from "@/components/BackgroundDecor";
import HowCard from "@/components/ui/HowCard";
import FAQ from "@/components/ui/FAQ";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter, usePathname } from "next/navigation";

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { ready, authenticated, login, logout } = usePrivy();

  const handleLogin = async () => {
    await login(); // opens Privy modal with external wallets
    router.push("/dashboard");
  };

  return (
    <>
      <ScrollStyles />
      <div
        className="relative min-h-screen w-full overflow-x-hidden text-white"
        style={{
          background: `linear-gradient(180deg, ${COLORS.bgFrom} 0%, ${COLORS.bgVia} 40%, ${COLORS.bgTo} 100%)`,
        }}
      >
        <BackgroundDecor />
        <Header />

        {/* Hero */}
        <section className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center justify-center px-6 py-28 md:py-32 text-center min-h-screen">
          <h1
            className="text-4xl font-semibold leading-tight md:text-6xl"
            style={{ color: COLORS.headline }}
          >
            Get rewarded for your Amazon data
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-zinc-300">
            Take control of your shopping data. Prove it privately, store a
            redacted summary on Lighthouse, and earn AMZ.
          </p>
          <button
            onClick={handleLogin}
            disabled={loading}
            className="mt-6 rounded-full px-6 py-3 text-base font-semibold text-black shadow-lg hover:opacity-90 active:scale-[.98]"
            style={{
              background: `linear-gradient(90deg, ${COLORS.yellowFrom}, ${COLORS.yellowTo})`,
            }}
          >
            Start Earning
          </button>
        </section>

        {/* Why choose */}
        <section className="relative z-10 mx-auto flex w-full flex-col items-center justify-center px-6 py-24 md:py-28">
          <div className="w-full max-w-6xl">
            <h2 className="mb-10 text-center text-3xl font-semibold md:text-4xl">
              Why choose POP Rewards?
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <HowCard
                icon="🛡️"
                title="Privacy First"
                desc="Zero-knowledge proofs via Reclaim. We store only a redacted summary on Lighthouse."
              />
              <HowCard
                icon="🔑"
                title="Self-custody Sign-in"
                desc="Wallet/Privy login. You control when to connect providers and share proofs."
              />
              <HowCard
                icon="🎯"
                title="Real Rewards"
                desc="Earn POP for recent verified orders. Points logic is transparent and on-chain."
              />
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="relative z-10 mx-auto flex w-full flex-col items-center justify-center px-6 py-24 md:py-28">
          <div className="w-full max-w-6xl">
            <h2 className="mb-10 text-center text-3xl font-semibold md:text-4xl">
              How It Works
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              <HowCard
                icon="🔗"
                title="Connect Your Wallet"
                desc="Use an EVM wallet like MetaMask to get started."
              />
              <HowCard
                icon="🧾"
                title="Verify Purchases"
                desc="Run Reclaim to generate a private proof of your orders."
              />
              <HowCard
                icon="🗂️"
                title="Store Summary"
                desc="We upload a redacted JSON summary to Lighthouse."
              />
              <HowCard
                icon="🎁"
                title="Earn Rewards"
                desc="Get POP tokens based on recent valid orders."
              />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="relative z-10 mx-auto flex w-full flex-col items-center px-6 py-24 md:py-28">
          <div className="w-full max-w-3xl">
            <h2 className="text-center text-3xl font-semibold md:text-4xl">
              Frequently asked questions
            </h2>
            <div className="mt-8 grid gap-3">
              <FAQ
                q="How is my data used"
                a="Your Reclaim proof is verified on the backend. We store only a sanitized summary on Lighthouse and hash sensitive fields."
              />
              <FAQ
                q="What devices are supported"
                a="Any device with a modern browser and an Ethereum wallet like MetaMask or Rainbow."
              />
              <FAQ
                q="What rewards can I earn"
                a="AMZ ERC20 tokens on Sepolia for the demo. Amount depends on your recent order count."
              />
              <FAQ
                q="Can I withdraw rewards as cash"
                a="Not in the demo. You can transfer AMZ like any ERC20."
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative z-10 mx-auto flex w-full flex-col items-center px-6 py-24 md:py-28 text-center">
          <div className="w-full max-w-5xl">
            <h3 className="text-4xl font-semibold">
              Ready to turn your data into rewards
            </h3>
            <p className="mt-4 text-zinc-300">
              Click Start Earning to open Privy and begin the flow.
            </p>
            <button
              onClick={handleLogin}
              disabled={loading}
              className="mt-8 rounded-full px-6 py-3 text-base font-semibold text-black shadow-lg hover:opacity-90 active:scale-[.98]"
              style={{
                background: `linear-gradient(90deg, ${COLORS.yellowFrom}, ${COLORS.yellowTo})`,
              }}
            >
              Start Earning
            </button>
          </div>
        </section>
      </div>
    </>
  );
}

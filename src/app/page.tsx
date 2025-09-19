"use client";

import { useState } from "react";
import { COLORS } from "@/lib/colors";
import Header from "@/components/Header";
import ScrollStyles from "@/components/ScrollStyles";
import BackgroundDecor from "@/components/BackgroundDecor";
import HowCard from "@/components/ui/HowCard";
import FAQ from "@/components/ui/FAQ";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import {
  Shield,
  Wallet,
  Gift,
  Link2,
  FileCheck,
  Database,
  Coins,
} from "lucide-react";

export default function HomePage() {
  const [loading] = useState(false);
  const router = useRouter();
  const { login } = usePrivy();

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
        <section className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center justify-center px-6 py-28 md:py-32 text-center md:min-h-screen">
          <h1
            className="text-4xl font-semibold leading-tight md:text-6xl"
            style={{ color: COLORS.headline }}
          >
            Turn your shopping into rewards.
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-zinc-300">
            Your Amazon order history has value. With POP Rewards, you stay in
            control of your data while earning crypto for every purchase you
            prove.
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
                icon={<Shield className="w-6 h-6" />}
                title="Your data stays private"
                desc="We never see your full order details. Proofs are generated privately and only a summary is stored."
              />
              <HowCard
                icon={<Wallet className="w-6 h-6" />}
                title="Sign in with your wallet"
                desc="No passwords, no hassle. Use your own crypto wallet to log in securely."
              />
              <HowCard
                icon={<Gift className="w-6 h-6" />}
                title="Rewards you can use"
                desc="Earn POP tokens every time you prove valid purchases. Redeem them for perks, swaps, or hold them for future value."
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
                icon={<Link2 className="w-6 h-6" />}
                title="Connect Your Wallet"
                desc="Use an EVM wallet to get started."
              />
              <HowCard
                icon={<FileCheck className="w-6 h-6" />}
                title="Verify Purchases"
                desc="Run a quick check with zkTLS to prove your Amazon purchases privately."
              />
              <HowCard
                icon={<Database className="w-6 h-6" />}
                title="Get credit for your data"
                desc="We upload a redacted JSON summary to Lighthouse."
              />
              <HowCard
                icon={<Coins className="w-6 h-6" />}
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
                a="Only the proof of purchase is stored on Lighthouse. We never keep sensitive details."
              />
              <FAQ
                q="What devices are supported"
                a="Any device with a modern browser and an Ethereum wallet."
              />
              <FAQ
                q="What rewards can I earn"
                a="POP tokens, based on how many valid orders you prove."
              />
              <FAQ
                q="Can I withdraw rewards as cash"
                a="Yes, POP is a crypto token. You can swap it or use it in our ecosystem as we grow."
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative z-10 mx-auto flex w-full flex-col items-center px-6 py-24 md:py-28 text-center">
          <div className="w-full max-w-5xl">
            <h3 className="text-4xl font-semibold">
              Don’t let your data go to waste.
            </h3>
            <p className="mt-4 text-zinc-300">
              Start earning rewards today all while staying private and in
              control.
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

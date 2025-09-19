"use client";

import { useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    if (!authenticated) router.replace("/");
  }, [ready, authenticated, router]);

  if (!ready || !authenticated) return null; // no flicker
  return <>{children}</>;
}

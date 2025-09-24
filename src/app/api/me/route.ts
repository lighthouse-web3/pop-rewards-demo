// apps/api/me/route.ts
import { NextResponse } from "next/server";
import { getProofsByAddress, getOrdersByAddress } from "@/lib/db";
import { getCallerAddress } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const address = getCallerAddress(req);
  if (!address)
    return NextResponse.json({ error: "Missing x-session" }, { status: 401 });

  const url = new URL(req.url);
  const withOrders = url.searchParams.get("include") === "orders";

  const records = await getProofsByAddress(address);
  if (!withOrders) return NextResponse.json({ records });

  const orders = await getOrdersByAddress(address, 100);
  return NextResponse.json({ records, orders });
}

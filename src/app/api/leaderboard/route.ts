import { NextResponse } from "next/server";
import { topWallets } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await topWallets(20);
  return NextResponse.json({ leaders: rows });
}

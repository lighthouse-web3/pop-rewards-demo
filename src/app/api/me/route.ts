import { NextResponse } from "next/server";
import { getByAddress } from "@/lib/db";
import { getCallerAddress } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const address = getCallerAddress(req);
  if (!address)
    return NextResponse.json({ error: "Missing x-session" }, { status: 401 });

  const rows = await getByAddress(address);
  return NextResponse.json({ records: rows });
}

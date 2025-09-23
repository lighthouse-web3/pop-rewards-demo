import { NextResponse } from "next/server";
import { verifyProof } from "@reclaimprotocol/js-sdk";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json(); // can be array/object
    const ok = await verifyProof(body);
    return NextResponse.json({ is_valid: ok }, { status: ok ? 200 : 400 });
  } catch (e) {
    console.error("Reclaim verify error:", e);
    return NextResponse.json(
      { error: "Failed to verify proof" },
      { status: 500 }
    );
  }
}

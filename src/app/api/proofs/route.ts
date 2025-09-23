import { NextResponse } from "next/server";
import { verifyProof } from "@reclaimprotocol/js-sdk";
import { addRecord, ProofRecord } from "@/lib/db";
import { getCallerAddress } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function cors() {
  const o = process.env.ALLOWED_ORIGIN || "*";
  return {
    "Access-Control-Allow-Origin": o,
    "Access-Control-Allow-Headers": "Content-Type,x-session",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
  };
}

export async function OPTIONS() {
  return new NextResponse(null, { headers: cors() });
}

export async function POST(req: Request) {
  try {
    const headers = cors();
    const address = getCallerAddress(req);
    if (!address) {
      return NextResponse.json(
        { error: "Missing or invalid x-session" },
        { status: 401, headers }
      );
    }

    const { proofs, username } = await req.json();
    if (!proofs)
      return NextResponse.json(
        { error: "Missing proofs" },
        { status: 400, headers }
      );

    const valid = await verifyProof(proofs);
    if (!valid)
      return NextResponse.json(
        { error: "Invalid proof" },
        { status: 400, headers }
      );

    const apiKey = process.env.LIGHTHOUSE_API_KEY;
    if (!apiKey)
      return NextResponse.json(
        { error: "Server misconfigured (no LIGHTHOUSE_API_KEY)" },
        { status: 500, headers }
      );

    // Compact redacted JSON
    const payload = {
      username,
      address: address.toLowerCase(),
      providerId: process.env.NEXT_PUBLIC_RECLAIM_PROVIDER_ID,
      createdAt: new Date().toISOString(),
    };
    const text = JSON.stringify(payload);

    const lighthouse = (await import("@lighthouse-web3/sdk")).default;
    const uploadRes = await lighthouse.uploadText(text, apiKey);
    const cid: string = uploadRes?.data?.Hash;
    if (!cid) throw new Error("No CID returned from Lighthouse");

    // +1 per proof, same as before
    const record: ProofRecord = {
      id: crypto.randomUUID(), // let’s use uuid now
      address: address.toLowerCase(),
      username: username || "anon",
      cid,
      providerId: process.env.NEXT_PUBLIC_RECLAIM_PROVIDER_ID || "unknown",
      createdAt: new Date().toISOString(),
      points: 1,
    };

    await addRecord(record);

    // optional: refresh MV if you used it
    // await supa.rpc("refresh_leaderboard");

    return NextResponse.json(
      { success: true, cid, record },
      { status: 200, headers }
    );
  } catch (e) {
    console.error("POST /api/proofs error:", e);
    return NextResponse.json(
      { error: "Server error" },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN || "*",
        },
      }
    );
  }
}

// apps/api/proofs/route.ts
import { NextResponse } from "next/server";
import { verifyProof } from "@reclaimprotocol/js-sdk";
import { addProof, addOrders, ProofRecord } from "@/lib/db";
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

// helpers
function inrToNumber(text?: string | null): number | null {
  if (!text) return null;
  // remove currency, commas, spaces
  const cleaned = text.replace(/[₹,\s]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function parseOrderDate(s?: string | null): string | null {
  if (!s) return null;
  // s like: "August 13, 2025 at 08:14 PM"
  const d = new Date(s.replace(" at ", " "));
  return isNaN(+d) ? null : d.toISOString();
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

    // 1) Verify Reclaim proof
    const valid = await verifyProof(proofs);
    if (!valid)
      return NextResponse.json(
        { error: "Invalid proof" },
        { status: 400, headers }
      );

    // 2) Extract Zomato orders
    const ordersRaw: any[] =
      proofs?.publicData?.orders || proofs?.[0]?.publicData?.orders || [];
    const normalized = ordersRaw.map((o) => {
      const delivered = Number(o?.deliveryDetails?.deliveryStatus) || null;
      return {
        orderId: Number(o?.orderId),
        orderDate: parseOrderDate(o?.orderDate),
        totalCostNum: inrToNumber(o?.totalCost),
        totalCostText: o?.totalCost ?? null,
        dishString: o?.dishString ?? null,
        deliveryStatus: delivered,
        deliveryLabel: o?.deliveryDetails?.deliveryLabel ?? null,
        restaurantURL: o?.restaurantURL ?? null,
      };
    });

    // Scoring: delivered only (status === 4)
    const delivered = normalized.filter((o) => o.deliveryStatus === 4);
    const orderCount = delivered.length;
    const amountTotal =
      delivered.reduce((sum, o) => sum + (o.totalCostNum || 0), 0) || 0;

    // 3) Upload a compact summary to Lighthouse
    const apiKey = process.env.LIGHTHOUSE_API_KEY;
    if (!apiKey)
      return NextResponse.json(
        { error: "Server misconfigured (no LIGHTHOUSE_API_KEY)" },
        { status: 500, headers }
      );

    const payload = {
      username: username || null,
      address: address.toLowerCase(),
      providerId: process.env.NEXT_PUBLIC_RECLAIM_PROVIDER_ID || "zomato",
      createdAt: new Date().toISOString(),
      summary: {
        orderCount,
        amountTotalINR: Number(amountTotal.toFixed(2)),
        deliveredOrderIds: delivered.slice(0, 50).map((o) => o.orderId), // keep it compact
      },
    };

    const lighthouse = (await import("@lighthouse-web3/sdk")).default;
    const uploadRes = await lighthouse.uploadText(
      JSON.stringify(payload),
      apiKey
    );
    const cid: string = uploadRes?.data?.Hash;
    if (!cid) throw new Error("No CID returned from Lighthouse");

    // 4) Save proof row
    const proof: ProofRecord = {
      id: crypto.randomUUID(),
      address: address.toLowerCase(),
      username: username || "anon",
      cid,
      providerId: process.env.NEXT_PUBLIC_RECLAIM_PROVIDER_ID || "zomato",
      createdAt: new Date().toISOString(),
      points: Math.max(1, orderCount), // simple scoring: >=1 point
      orderCount,
      amountTotal: Number(amountTotal.toFixed(2)),
    };
    const saved = await addProof(proof);

    // 5) Save orders (all, not just delivered; up to you)
    await addOrders(
      normalized.map((o) => ({
        proofId: saved.id,
        address: address.toLowerCase(),
        orderId: o.orderId,
        orderDate: o.orderDate,
        totalCostNum: o.totalCostNum,
        totalCostText: o.totalCostText,
        dishString: o.dishString,
        deliveryStatus: o.deliveryStatus,
        deliveryLabel: o.deliveryLabel,
        restaurantURL: o.restaurantURL,
      }))
    );

    // OPTIONAL: refresh MV if you use it
    // await supa.rpc("refresh_leaderboard");

    return NextResponse.json(
      {
        success: true,
        cid,
        record: saved,
        metrics: { orderCount, amountTotal: Number(amountTotal.toFixed(2)) },
      },
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

// src/lib/db.ts (Supabase-backed)
import { supa } from "./supabaseServer";

export type ProofRecord = {
  id: string;
  address: string; // lowercased
  username: string | null;
  cid: string;
  providerId: string | null;
  createdAt: string; // ISO
  points?: number;
};

function mapRow(row: any): ProofRecord {
  return {
    id: row.id,
    address: row.address,
    username: row.username ?? null,
    cid: row.cid,
    providerId: row.provider_id ?? null,
    createdAt: row.created_at,
    points: row.points ?? 1,
  };
}

export async function addRecord(rec: ProofRecord) {
  const { data, error } = await supa
    .from("proofs")
    .insert({
      id: rec.id, // you can omit to let DB generate
      address: rec.address.toLowerCase(),
      username: rec.username,
      cid: rec.cid,
      provider_id: rec.providerId,
      created_at: rec.createdAt,
      points: rec.points ?? 1,
    })
    .select("*")
    .single();

  if (error) throw error;
  return mapRow(data);
}

export async function getByAddress(addr: string) {
  const { data, error } = await supa
    .from("proofs")
    .select("*")
    .eq("address", addr.toLowerCase())
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []).map(mapRow);
}

export async function topWallets(limit = 20) {
  // Option A: plain GROUP BY
  const { data, error } = await supa
    .from("proofs")
    .select("address, points")
    .limit(5000); // safety; adjust if you have real volume

  if (error) throw error;

  const acc = new Map<string, number>();
  for (const r of data || []) {
    const address = (r.address as string).toLowerCase();
    const pts = typeof r.points === "number" ? r.points : 1;
    acc.set(address, (acc.get(address) || 0) + pts);
  }

  return [...acc.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([address, pts]) => ({ address, pts }));

  // Option B: materialized view if you created it:
  // const { data: mv, error: e2 } = await supa
  //   .from("leaderboard_mv")
  //   .select("address, pts")
  //   .order("pts", { ascending: false })
  //   .limit(limit);
  // if (e2) throw e2;
  // return mv || [];
}

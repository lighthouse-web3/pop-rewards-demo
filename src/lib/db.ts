// src/lib/db.ts
import { supa } from "./supabaseServer";

export type ProofRecord = {
  id: string;
  address: string;
  username: string | null;
  cid: string;
  providerId: string | null;
  createdAt: string;
  points?: number;
  orderCount?: number;
  amountTotal?: number; // numeric
};

export type OrderRow = {
  id: string;
  proofId: string;
  address: string;
  orderId: number;
  orderDate: string | null; // ISO
  totalCostNum: number | null;
  totalCostText: string | null;
  dishString: string | null;
  deliveryStatus: number | null;
  deliveryLabel: string | null;
  restaurantURL: string | null;
  createdAt: string; // ISO
};

function mapProof(row: any): ProofRecord {
  return {
    id: row.id,
    address: row.address,
    username: row.username ?? null,
    cid: row.cid,
    providerId: row.provider_id ?? null,
    createdAt: row.created_at,
    points: row.points ?? 1,
    orderCount: row.order_count ?? 0,
    amountTotal:
      row.amount_total != null ? Number(row.amount_total) : undefined,
  };
}

function mapOrder(row: any): OrderRow {
  return {
    id: row.id,
    proofId: row.proof_id,
    address: row.address,
    orderId: Number(row.order_id),
    orderDate: row.order_date ? new Date(row.order_date).toISOString() : null,
    totalCostNum:
      row.total_cost_num != null ? Number(row.total_cost_num) : null,
    totalCostText: row.total_cost_text ?? null,
    dishString: row.dish_string ?? null,
    deliveryStatus:
      row.delivery_status != null ? Number(row.delivery_status) : null,
    deliveryLabel: row.delivery_label ?? null,
    restaurantURL: row.restaurant_url ?? null,
    createdAt: row.created_at,
  };
}

/** Insert a proof row */
export async function addProof(rec: ProofRecord): Promise<ProofRecord> {
  const { data, error } = await supa
    .from("proofs")
    .insert({
      id: rec.id,
      address: rec.address.toLowerCase(),
      username: rec.username,
      cid: rec.cid,
      provider_id: rec.providerId,
      created_at: rec.createdAt,
      points: rec.points ?? 1,
      order_count: rec.orderCount ?? 0,
      amount_total: rec.amountTotal ?? 0,
    })
    .select("*")
    .single();

  if (error) throw error;
  return mapProof(data);
}

/** Bulk insert orders for a proof */
export async function addOrders(rows: Omit<OrderRow, "id" | "createdAt">[]) {
  if (!rows.length) return [];

  const payload = rows.map((r) => ({
    proof_id: r.proofId,
    address: r.address.toLowerCase(),
    order_id: r.orderId,
    order_date: r.orderDate ? new Date(r.orderDate).toISOString() : null,
    total_cost_num: r.totalCostNum,
    total_cost_text: r.totalCostText,
    dish_string: r.dishString,
    delivery_status: r.deliveryStatus,
    delivery_label: r.deliveryLabel,
    restaurant_url: r.restaurantURL,
  }));

  const { data, error } = await supa.from("orders").insert(payload).select("*");
  if (error) throw error;
  return (data || []).map(mapOrder);
}

/** Get proofs by wallet */
export async function getProofsByAddress(addr: string): Promise<ProofRecord[]> {
  const { data, error } = await supa
    .from("proofs")
    .select("*")
    .eq("address", addr.toLowerCase())
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []).map(mapProof);
}

/** Get orders by wallet (optionally limit) */
export async function getOrdersByAddress(
  addr: string,
  limit = 50
): Promise<OrderRow[]> {
  const { data, error } = await supa
    .from("orders")
    .select("*")
    .eq("address", addr.toLowerCase())
    .order("order_date", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data || []).map(mapOrder);
}

/** Leaderboard: sum points from proofs (simple) */
export async function topWallets(limit = 20) {
  const { data, error } = await supa
    .from("proofs")
    .select("address, points")
    .limit(10000); // keep sane

  if (error) throw error;

  const acc = new Map<string, number>();
  for (const r of data || []) {
    const key = (r.address as string).toLowerCase();
    const pts = typeof r.points === "number" ? r.points : 1;
    acc.set(key, (acc.get(key) || 0) + pts);
  }

  return [...acc.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([address, pts]) => ({ address, pts }));
}

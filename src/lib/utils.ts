export function short(addr?: string) {
  return addr ? `${addr.slice(0, 8)}…${addr.slice(-6)}` : "";
}

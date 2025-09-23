export function getCallerAddress(req: Request) {
  const header = req.headers.get("x-session") || "";
  if (!/^0x[a-fA-F0-9]{40}$/.test(header)) return null;
  return header.toLowerCase();
}

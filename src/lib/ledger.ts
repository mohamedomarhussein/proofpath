import { createHmac, timingSafeEqual } from "crypto";

const secret = () => process.env.LEDGER_SECRET || "proofpath-dev-secret-change-me";
const mac = (body: string) => createHmac("sha256", secret()).update(body).digest("base64url");

// token = base64url(payload) + "." + base64url(HMAC signature)
export function sign(payload: object): string {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${mac(body)}`;
}

export function verify(token: string): { valid: boolean; credential?: any } {
  const parts = token.split(".");
  if (parts.length !== 2 || !parts[0] || !parts[1]) return { valid: false };
  const [body, sig] = parts;
  const a = Buffer.from(sig);
  const b = Buffer.from(mac(body));
  if (a.length !== b.length || !timingSafeEqual(a, b)) return { valid: false };
  try {
    const credential = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (!credential || typeof credential !== "object" || !credential.credentialSubject) return { valid: false };
    return { valid: true, credential };
  } catch {
    return { valid: false };
  }
}

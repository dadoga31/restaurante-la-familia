import { createHmac } from "crypto";
import { cookies } from "next/headers";

const SECRET = process.env.SESSION_SECRET ?? "la-familia-secret-fallback";
const COOKIE_NAME = "lf_admin_session";

export function signToken(email: string): string {
  const sig = createHmac("sha256", SECRET).update(email).digest("hex");
  return Buffer.from(`${email}:${sig}`).toString("base64url");
}

export function verifyToken(token: string): string | null {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf-8");
    const [email, sig] = decoded.split(":");
    const expected = createHmac("sha256", SECRET).update(email).digest("hex");
    if (sig !== expected) return null;
    return email;
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export function setSessionCookie(email: string): string {
  return `${COOKIE_NAME}=${signToken(email)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`;
}

export function clearSessionCookie(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

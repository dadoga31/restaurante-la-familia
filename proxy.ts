import { NextRequest, NextResponse } from "next/server";

const SECRET = process.env.SESSION_SECRET ?? "la-familia-secret-fallback";

async function verifyToken(token: string): Promise<string | null> {
  try {
    const decoded = atob(token.replace(/-/g, "+").replace(/_/g, "/"));
    const colonIdx = decoded.lastIndexOf(":");
    if (colonIdx === -1) return null;
    const email = decoded.slice(0, colonIdx);
    const sigHex = decoded.slice(colonIdx + 1);

    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw", enc.encode(SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false, ["verify"]
    );
    const sigBytes = new Uint8Array(
      (sigHex.match(/.{2}/g) ?? []).map((b) => parseInt(b, 16))
    );
    const valid = await crypto.subtle.verify("HMAC", key, sigBytes, enc.encode(email));
    return valid ? email : null;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPage = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isAdminApi = pathname.startsWith("/api/admin");

  if (isAdminPage || isAdminApi) {
    const token = request.cookies.get("lf_admin_session")?.value;
    if (!token || !(await verifyToken(token))) {
      if (isAdminApi) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

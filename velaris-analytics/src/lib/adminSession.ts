type AdminSessionPayload = {
  v: 1;
  iat: number;
  exp: number;
};

export const ADMIN_SESSION_COOKIE_NAME = "velaris_admin";

function base64UrlEncode(bytes: Uint8Array) {
  const base64 =
    typeof Buffer !== "undefined"
      ? Buffer.from(bytes).toString("base64")
      : btoa(
          Array.from(bytes, (b) => String.fromCharCode(b)).join("")
        );

  return base64.replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function base64UrlDecode(input: string) {
  const base64 = input.replaceAll("-", "+").replaceAll("_", "/");
  const padded =
    base64 + "=".repeat((4 - (base64.length % 4 || 4)) % 4);

  if (typeof Buffer !== "undefined") {
    return new Uint8Array(Buffer.from(padded, "base64"));
  }

  const bin = atob(padded);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

function constantTimeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i += 1) {
    out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return out === 0;
}

async function hmacSha256Base64Url(secret: string, data: string) {
  const enc = new TextEncoder();
  const cryptoImpl = globalThis.crypto;
  if (!cryptoImpl?.subtle) throw new Error("Crypto unavailable");

  const key = await cryptoImpl.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await cryptoImpl.subtle.sign("HMAC", key, enc.encode(data));
  return base64UrlEncode(new Uint8Array(sig));
}

export async function createAdminSessionCookieValue(
  secret: string,
  maxAgeSeconds = 60 * 60 * 24 * 7
) {
  const now = Math.floor(Date.now() / 1000);
  const payload: AdminSessionPayload = {
    v: 1,
    iat: now,
    exp: now + maxAgeSeconds,
  };

  const payloadB64 = base64UrlEncode(
    new TextEncoder().encode(JSON.stringify(payload))
  );
  const sigB64 = await hmacSha256Base64Url(secret, payloadB64);
  return `${payloadB64}.${sigB64}`;
}

export async function verifyAdminSessionCookieValue(
  secret: string,
  cookieValue: string
) {
  const [payloadB64, sigB64] = cookieValue.split(".");
  if (!payloadB64 || !sigB64) return false;

  const expectedSig = await hmacSha256Base64Url(secret, payloadB64);
  if (!constantTimeEqual(expectedSig, sigB64)) return false;

  const decoded = new TextDecoder().decode(base64UrlDecode(payloadB64));
  let payload: AdminSessionPayload | null = null;
  try {
    payload = JSON.parse(decoded) as AdminSessionPayload;
  } catch {
    return false;
  }

  if (!payload || payload.v !== 1) return false;
  const now = Math.floor(Date.now() / 1000);
  if (typeof payload.exp !== "number" || payload.exp <= now) return false;
  return true;
}


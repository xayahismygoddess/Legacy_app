import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { cookies } from "next/headers";

export const COOKIE_NAME = "auth_token";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

// 🔐 Password utils
export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

// 🔑 JWT utils
export async function createToken(payload: JWTPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyToken(token: string) {
  return jwtVerify(token, secret);
}

// 👤 Session helper (ESTO FALTABA)
export async function getSession() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;

  if (!token) return null;

  try {
    const { payload } = await verifyToken(token);
    return payload;
  } catch {
    return null;
  }
}

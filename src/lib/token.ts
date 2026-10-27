import { randomInt } from "node:crypto";

// Tanpa huruf/angka yang mirip (0/o, 1/l/i) agar mudah dibaca bila diketik ulang
const ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789";
export const TOKEN_PATTERN = /^[a-z0-9]{6,12}$/;

export function generateToken(length = 6) {
  let out = "";
  for (let i = 0; i < length; i++) out += ALPHABET[randomInt(ALPHABET.length)];
  return out;
}

export function isValidTokenFormat(token: string) {
  return TOKEN_PATTERN.test(token);
}

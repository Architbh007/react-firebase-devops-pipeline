// src/lib/bcrypt.js
import bcrypt from "bcryptjs";

// hash with salt rounds (10 is common)
export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

export async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

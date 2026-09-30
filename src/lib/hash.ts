import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

/**
 * Mengubah password menjadi hash.
 */
export async function hashPassword(password: string) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Membandingkan password input dengan hash di database.
 */
export async function comparePassword(
  password: string,
  hashedPassword: string
) {
  return bcrypt.compare(password, hashedPassword);
}
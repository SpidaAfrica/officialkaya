import crypto from "crypto";
// Ensure the secret key is 32 bytes long
const secretKey = crypto
  .createHash("sha256")
  .update("0U15Z67yACDFGIJKLNmPQR2STVX9YabBcdE4efghi3jklnMoOpqrstHuv8wxzW")
  .digest();
/**
 * Encrypts an object and returns the encrypted string.
 * @param data - The object to encrypt.
 * @returns The encrypted string.
 */
export function encrypt<T>(data: T): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(secretKey),
    iv
  );
  let encrypted = cipher.update(JSON.stringify(data), "utf-8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
}

/**
 * Decrypts an encrypted string and returns the original object.
 * @param data - The encrypted string.
 * @returns The decrypted object.
 */
export function decrypt<T>(data: string): T {
  const [iv, encryptedData] = data.split(":");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(secretKey),
    Buffer.from(iv, "hex")
  );
  let decrypted = decipher.update(encryptedData, "hex", "utf-8");
  decrypted += decipher.final("utf-8");
  return JSON.parse(decrypted) as T;
}

/**
 * Sets an encrypted cookie with expiration.
 * @param name - The name of the cookie.
 * @param data - The data to store.
 * @param expires - The expiration date of the cookie.
 */
export function setEncryptedCookie<T>(
  name: string,
  data: T,
  expires: Date
): void {
  const encryptedData = encrypt(data);
  document.cookie = `${name}=${encryptedData}; path=/; expires=${expires.toUTCString()}`;
}

/**
 * Retrieves a cookie value by name.
 * @param name - The name of the cookie to retrieve.
 * @returns The value of the cookie, or null if not found.
 */
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null; // Ensure client-side execution
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

/**
 * Retrieves and decrypts an object from a cookie.
 * @param name - The name of the cookie.
 * @returns The decrypted object, or null if not found.
 */
export function getDecryptedCookie<T>(name: string): T | null {
  const cookieValue = getCookie(name);
  if (cookieValue) {
    try {
      return decrypt<T>(cookieValue);
    } catch (e) {
      console.error("Failed to decrypt cookie", e);
    }
  }
  return null;
}

/**
 * Clears a cookie by setting its expiration date to a past date.
 * @param name - The name of the cookie to clear.
 */
export function clearCookie(name: string): void {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
}

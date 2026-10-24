import { createHash, createHmac, timingSafeEqual } from "node:crypto";

/**
 * Hash de integridad del Botón de pagos de Bold:
 * SHA-256 en hexadecimal de `${orderId}${monto}${divisa}${llaveSecreta}` (el orden importa).
 * Se calcula SOLO en el servidor: la llave secreta nunca llega al navegador.
 */
export function integritySignature(orderId: string, amount: number, currency: string, secret: string): string {
  return createHash("sha256").update(`${orderId}${amount}${currency}${secret}`).digest("hex");
}

/**
 * Firma del webhook (header x-bold-signature): HMAC-SHA256 en hexadecimal del cuerpo crudo
 * codificado en base64, con la llave secreta. En modo pruebas Bold firma con llave vacía ("").
 */
export function verifyBoldSignature(rawBody: string, signature: string | null, secret: string): boolean {
  if (!signature) return false;
  const encoded = Buffer.from(rawBody, "utf8").toString("base64");
  const expected = Buffer.from(createHmac("sha256", secret).update(encoded).digest("hex"), "utf8");
  const given = Buffer.from(signature.trim().toLowerCase(), "utf8");
  return expected.length === given.length && timingSafeEqual(expected, given);
}

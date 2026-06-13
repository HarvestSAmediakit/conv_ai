import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  // Graceful fallback for local development if needed, but in production this should throw
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET environment variable is required for production security');
  }
}
const ACTUAL_SECRET = JWT_SECRET || 'convomag_dev_fallback_secret_only_for_non_prod';

/**
 * Hashes a plaintext password using PBKDF2 with a secure random salt.
 * Returns a composite string of salt and hash: 'salt:hash'.
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Securely verifies a password against a stored composite hash using constant-time comparison.
 */
export function verifyPassword(password: string, stored: string): boolean {
  try {
    const [salt, originalHash] = stored.split(':');
    if (!salt || !originalHash) return false;
    
    const verifyHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    
    // Constant-time buffer comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(originalHash, 'hex'),
      Buffer.from(verifyHash, 'hex')
    );
  } catch (err) {
    return false;
  }
}

/**
 * Base64URL encoding helper.
 */
function base64url(buf: Buffer): string {
  return buf.toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

/**
 * Base64URL decoding helper.
 */
function base64urlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return Buffer.from(base64, 'base64').toString('utf8');
}

/**
 * Generates a lightweight, secure JSON Web Token (JWT) signed with HMAC-SHA256.
 * Now includes standard expiration (exp) and issued-at (iat) claims.
 */
export function signToken(payload: any, expiresIn: string = '24h'): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  
  // Convert expiresIn (e.g. '24h', '7d') to seconds
  let expSeconds = 86400; // default 24h
  if (expiresIn.endsWith('h')) expSeconds = parseInt(expiresIn) * 3600;
  if (expiresIn.endsWith('d')) expSeconds = parseInt(expiresIn) * 86400;

  const fullPayload = {
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + expSeconds
  };
  
  const headerEncoded = base64url(Buffer.from(JSON.stringify(header)));
  const payloadEncoded = base64url(Buffer.from(JSON.stringify(fullPayload)));
  
  const signatureInput = `${headerEncoded}.${payloadEncoded}`;
  const signature = crypto.createHmac('sha256', ACTUAL_SECRET)
    .update(signatureInput)
    .digest();
    
  return `${signatureInput}.${base64url(signature)}`;
}

/**
 * Verifies and decodes an HMAC-SHA256 signed JSON Web Token (JWT).
 * Returns decoded payload if signature is valid; otherwise null.
 */
export function verifyToken(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const [headerEncoded, payloadEncoded, signatureEncoded] = parts;
    
    const signatureInput = `${headerEncoded}.${payloadEncoded}`;
    const expectedSignature = crypto.createHmac('sha256', ACTUAL_SECRET)
      .update(signatureInput)
      .digest();
      
    const actualSignature = Buffer.from(signatureEncoded.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
    
    const isValid = crypto.timingSafeEqual(expectedSignature, actualSignature);
    if (!isValid) return null;
    
    return JSON.parse(base64urlDecode(payloadEncoded));
  } catch (err) {
    return null;
  }
}

// lib/tokenStore.js
// Access token'i .shopify-token.json dosyasına yazar/okur.
// Tek mağaza kurulumu için yeterlidir.

import fs from 'fs';
import path from 'path';

const TOKEN_FILE = path.join(process.cwd(), '.shopify-token.json');

export function saveToken(token) {
  fs.writeFileSync(TOKEN_FILE, JSON.stringify({ access_token: token }), 'utf-8');
}

export function loadToken() {
  if (!fs.existsSync(TOKEN_FILE)) return null;
  try {
    const data = JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf-8'));
    return data.access_token ?? null;
  } catch {
    return null;
  }
}

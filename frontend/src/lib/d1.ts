const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || '5294ebf66d98c4fb5b5ea11a27e9ce09';
const DB_ID = process.env.CLOUDFLARE_D1_DATABASE_ID || '84e0866f-fbd1-4527-9543-9ed7e727e2ee';
const CF_EMAIL = process.env.CLOUDFLARE_EMAIL || 'arvind.shukla64@gmail.com';
const CF_KEY = process.env.CLOUDFLARE_API_KEY || 'cb322ea2cf9e5c848c5876748c7ed3bf84fcb';

export async function queryD1(sql: string, params: any[] = []): Promise<any[]> {
  try {
    const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DB_ID}/query`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'X-Auth-Email': CF_EMAIL,
        'X-Auth-Key': CF_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql, params }),
    });

    const json = await res.json();
    if (json.success && json.result && json.result[0]) {
      return json.result[0].results || [];
    }
    console.error('[D1 Query Error]', json.errors);
    return [];
  } catch (err) {
    console.error('[D1 Network Error]', err);
    return [];
  }
}

import dotenv from 'dotenv';
dotenv.config();

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || '5294ebf66d98c4fb5b5ea11a27e9ce09';
const DB_ID = process.env.CLOUDFLARE_D1_DATABASE_ID || '84e0866f-fbd1-4527-9543-9ed7e727e2ee';
const CF_EMAIL = process.env.CLOUDFLARE_EMAIL || 'arvind.shukla64@gmail.com';
const CF_KEY = process.env.CLOUDFLARE_API_KEY || 'cb322ea2cf9e5c848c5876748c7ed3bf84fcb';

export async function runD1(sql: string, params: any[] = []): Promise<any[]> {
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

    const json = await res.json() as any;
    if (json.success && json.result && json.result[0]) {
      return json.result[0].results || [];
    }
    console.error('[D1 Error]', json.errors);
    return [];
  } catch (err: any) {
    console.error('[D1 Network Error]', err?.message);
    return [];
  }
}

class D1QueryBuilder {
  private table: string;
  private selectCols: string = '*';
  private whereClauses: string[] = [];
  private params: any[] = [];
  private orderClause: string = '';
  private limitNum: number | null = null;

  constructor(table: string) {
    this.table = table;
  }

  select(cols: string = '*') {
    this.selectCols = cols;
    return this;
  }

  eq(col: string, val: any) {
    this.whereClauses.push(`"${col}" = ?`);
    this.params.push(typeof val === 'boolean' ? (val ? 1 : 0) : val);
    return this;
  }

  gte(col: string, val: any) {
    this.whereClauses.push(`"${col}" >= ?`);
    this.params.push(val);
    return this;
  }

  lte(col: string, val: any) {
    this.whereClauses.push(`"${col}" <= ?`);
    this.params.push(val);
    return this;
  }

  order(col: string, options: { ascending?: boolean } = {}) {
    this.orderClause = `ORDER BY "${col}" ${options.ascending ? 'ASC' : 'DESC'}`;
    return this;
  }

  limit(num: number) {
    this.limitNum = num;
    return this;
  }

  async insert(data: any | any[]) {
    try {
      const rows = Array.isArray(data) ? data : [data];
      for (const row of rows) {
        if (this.table === 'Post') {
          if (!row.postType) {
            row.postType = 'general';
          }
        }
        if (!row.id) {
          row.id = crypto.randomUUID();
        }
        if (!row.createdAt) {
          row.createdAt = new Date().toISOString();
        }
        if (!row.updatedAt) {
          row.updatedAt = new Date().toISOString();
        }
        const keys = Object.keys(row);
        const values = keys.map((k) => {
          const v = row[k];
          if (typeof v === 'boolean') return v ? 1 : 0;
          if (v !== null && typeof v === 'object') return JSON.stringify(v);
          return v;
        });
        const placeholders = keys.map(() => '?').join(', ');
        const sql = `INSERT OR REPLACE INTO "${this.table}" ("${keys.join('", "')}") VALUES (${placeholders});`;
        await runD1(sql, values);
      }
      return { data: rows, error: null };
    } catch (err: any) {
      return { data: null, error: err };
    }
  }

  async upsert(data: any | any[]) {
    return this.insert(data);
  }

  // Promise-like resolution when awaited
  async then(resolve: (res: { data: any[]; error: any }) => void, reject?: (err: any) => void) {
    try {
      let sql = `SELECT ${this.selectCols} FROM "${this.table}"`;
      if (this.whereClauses.length > 0) {
        sql += ` WHERE ${this.whereClauses.join(' AND ')}`;
      }
      if (this.orderClause) {
        sql += ` ${this.orderClause}`;
      }
      if (this.limitNum !== null) {
        sql += ` LIMIT ${this.limitNum}`;
      }
      const data = await runD1(sql, this.params);
      resolve({ data, error: null });
    } catch (err: any) {
      if (reject) reject(err);
      else resolve({ data: [], error: err });
    }
  }
}

export function getD1Client() {
  return {
    from: (table: string) => new D1QueryBuilder(table),
  };
}

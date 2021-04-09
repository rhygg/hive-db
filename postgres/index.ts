import { Pool, PoolConfig, QueryResultRow, QueryResult } from "pg";

export interface hivePgOptions {
  table: string
}
export class hivePg {
  public pool: Pool;
  public options: QuickPGOptions;
  constructor(config: PoolConfig, options: HivePgOptions = { table: 'json' }) {
    this.options = options;
    this.pool = new Pool(config);

    this.query(`create table if not exists ${this.options.table} (key text, val text)`);
  }

  async all(): Promise<any> {
    const res = await this.query(`select * from ${this.options.table}`);
    const ret = [];
    const base = {};

    if (!res.rows || res.rows.length <= 0) return {}

    res.rows.map(r => ret.push({ [r.key]: JSON.parse(r.val) }));
    ret.map(e => Object.assign(base, e))
    return base;
  }

  async exists(key: string): Promise<boolean> {
    const res = await this.query(`select * from ${this.options.table} where key = ($1)`, [key]);

    if (!res.rows || res.rows.length <= 0) return false;
    return true;
  }

  async set(key: string, val: any) {
    try {
      JSON.stringify(val);
    } catch (e) {
      throw new Error("Could not stringify value.");
    }
    let found = await this.query(`select * from ${this.options.table} where key = ($1)`, [key]);
    if (found.rows.length > 0) { // exists, so update value
      try {
        await this.query(`update ${this.options.table} set val = ($2) where key = ($1)`, [key, JSON.stringify(val)]);
        return true;
      } catch (e) {
        throw new Error(e)
      }
    } else { // doesnt exist add
      try {
        await this.query(`insert into ${this.options.table} (key, val) VALUES ($1,$2)`, [key, JSON.stringify(val)]);
        return true;
      } catch (e) {
        throw new Error(e)
      }
    }
  }

  async get(key: string) {
    const res = await this.query(`select * from ${this.options.table} where key = ($1)`, [key]);

    if (!res.rows || res.rows.length <= 0) return null

    return JSON.parse(res.rows[0].val)
  }

  async delete(key: string) {
    try {
      await this.query(`delete from ${this.options.table} where key = ($1)`, [key]);
      return true;
    } catch (e) {
      throw new Error(e)
    }
  }

  async push(key: string, element: any) {
    try {
      JSON.stringify(element);
    } catch (e) {
      throw new Error("Could not stringify value.");
    }

    let found = await this.query(`select * from ${this.options.table} where key = ($1)`, [key]);
    if (found.rows.length > 0) { // exists, so update value
      try {
        const array = JSON.parse(found.rows[0].val);
        if (!Array.isArray(array)) throw new Error('Value gotten from key did not return as an array, will not override value.')
        array.push(element)
        await this.query(`update ${this.options.table} set val = ($2) where key = ($1)`, [key, JSON.stringify(array)]);
        return true;
      } catch (e) {
        throw new Error(e)
      }
    } else { // doesnt exist add
      try {
        await this.query(`insert into ${this.options.table} (key, val) VALUES ($1,$2)`, [key, JSON.stringify([element])]);
        return true;
      } catch (e) {
        throw new Error(e)
      }
    }
  }

  query(query: string, data: Array<any> = null): Promise<QueryResult> {
    return new Promise((res, rej) => {
      this.pool.query(query, data, (err, result) => {
        if (err) rej(err);
        return res(result)
      })
    })
  }
}

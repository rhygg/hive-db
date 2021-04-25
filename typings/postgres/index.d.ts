import { Pool, PoolConfig, QueryResult } from "pg";
export interface PostgresOptions {
    schema: string;
}
export declare class Postgres {
    pool: Pool;
    options: PostgresOptions;
    constructor(config: PoolConfig, options?: PostgresOptions);
    fetchArray(): Promise<any>;
    exists(key: string): Promise<boolean>;
    init(key: string, val: any): Promise<boolean>;
    get(key: string): Promise<any>;
    delete(key: string): Promise<boolean>;
    push(key: string, element: any): Promise<boolean>;
    search(query: string, data?: Array<any>): Promise<QueryResult>;
}

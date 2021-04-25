export = database;
declare class database extends Base {
    /**
     * @param {string}
     * @param {string}
     * @param {object}
     */
    constructor(mongodbURL: any, name: any, connectionOptions?: {});
    /**
     * @type {MongooseDocument}
     */
    schema: any;
    /**
     * @param {string} key
     * @param {any} value
     * @returns {Promise<any>}
     */
    init(key: string, value: any): Promise<any>;
    /**
     * @param {string} key
    */
    del(key: string): Promise<boolean>;
    /**
     * @param {string} key
     */
    exists(key: string): Promise<boolean>;
    /**
     * @param {string} key
     */
    has(key: string): Promise<boolean>;
    /**
     * @param {string} key
     */
    get(key: string): Promise<any>;
    /**
     * @param {string} key
     */
    fetch(key: string): Promise<any>;
    /**
     * @typedef {object} Data
     * @property {string} ID
     * @property {any} data
     */
    /**
     * @param {number} limit
     */
    fetchArray(limit?: number): Promise<any>;
    getArray(limit: any): Promise<any>;
    /**
     * @param {number} limit
     */
    fetchAll(limit: number): Promise<any>;
    delAll(): Promise<boolean>;
    /**
     * @param {string} key
     * @param {string} operator
     * @param {number} value
     */
    math(key: string, operator: string, value: number): Promise<any>;
    /**
     * @param {string} key
     * @param {number} Value
     */
    add(key: string, value: any): Promise<any>;
    /**
     * @param {string} key
     * @param {number} value
     */
    subtract(key: string, value: number): Promise<any>;
    /**
     * @type {number}
     */
    get uptime(): number;
    /**
     * @param {string} fileName
     * @param {string} path
     */
    export(fileName?: string, path?: string): Promise<any>;
    /**
     * @param {Array} data
     * @param {object} ops
     * @param {boolean}
     * @param {boolean}
     */
    import(data?: any[], ops?: object): Promise<any>;
    disconnect(): void;
    connect(url: any): any;
    get name(): any;
    _read(): Promise<number>;
    _write(): Promise<number>;
    /**
     * @typedef {object} DatabaseLatency
     * @property {number} read Read latency
     * @property {number} write Write latency
     * @property {number} average Average latency
     */
    fetchLatency(): Promise<{
        read: number;
        write: number;
        average: number;
    }>;
    ping(): Promise<{
        read: number;
        write: number;
        average: number;
    }>;
    /**
     * @param {string} key
     * @param {object} ops
     */
    startsWith(key: string, ops: object): Promise<any[]>;
    /**
     * Resolves data type
     * @param {string} key key
     * @example console.log(await db.type("foo"));
     * @returns {Promise<"string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function" | "array">}
     */
    datatype(key: string): Promise<"string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function" | "array">;
    /**
     * Returns array of the keys
     * @example const keys = await db.keyarray();
     * console.log(keys);
     * @returns {Promise<string[]>}
     */
    keyArray(): Promise<string[]>;
    /**
     * Returns array of the values
     * @example const data = await db.valueArray();
     * console.log(data);
     * @returns {Promise<any[]>}
     */
    valueArray(): Promise<any[]>;
    /**
     * Pushes an item into array
     * @param {string} key key
     * @param {any|any[]} value Value to push
     * @example db.push("users", "John"); // -> ["John"]
     * db.push("users", ["Milo", "Simon", "Kyle"]); // -> ["John", "Milo", "Simon", "Kyle"]
     * @returns {Promise<any>}
     */
    push(key: string, value: any | any[]): Promise<any>;
    /**
     * Removes an item from array
     * @param {string} key key
     * @param {any|any[]} value item to remove
     * @param {boolean} [multiple=true] if it should pull multiple items. Defaults to `true`.
     * <warn>Currently, you can use `multiple` with `non array` pulls only.</warn>
     * @example db.pull("users", "John"); // -> ["Milo", "Simon", "Kyle"]
     * db.pull("users", ["Milo", "Simon"]); // -> ["Kyle"]
     * @returns {Promise<any>}
     */
    delFromArray(key: string, value: any | any[], multiple?: boolean): Promise<any>;
    /**
     * Returns entries count of current model
     * @returns {Promise<number>}
     * @example const entries = await db.entries();
     * console.log(`There are total ${entries} entries!`);
     */
    entries(): Promise<number>;
    /**
     * Returns raw data from current model
     * @param {object} params Search params
     * @returns {Promise<MongooseDocument>}
     * @example const raw = await db.raw();
     * console.log(raw);
     */
    raw(params: object): Promise<any>;
    /**
     * Returns random entry from the database
     * @param {number} n Number entries to return
     * @returns {Promise<any[]>}
     * @example const random = await db.random();
     * console.log(random);
     */
    random(n?: number): Promise<any[]>;
    /**
     * This method acts like `quick.db#table`. It will return new instance of itself.
     * @param {string} name Model name
     * @returns {Database}
     */
    table(name: string): any;
    /**
     * This method exports **QuickMongo** data to **Quick.db**
     * @param {any} quickdb Quick.db instance
     * @returns {Promise<any[]>}
     * @example const data = await db.exportToQuickDB(quickdb);
     */
    /**
     * Returns **QuickMongo Util**
     * @example const parsed = db.utils.parseKey("foo.bar");
     * console.log(parsed);
     * @type {Util}
     */
    get utils(): Util;
    /**
     * Updates current model and uses new one
     * @param {string} name model name to use
     * @returns {MongooseDocument}
     */
    updateModel(name: string): any;
    /**
     * Allows you to eval code using `this` keyword.
     * @param {string} code
     */
    _eval(code: string): any;
}
declare namespace database {
    export { Data };
}
import Base = require("./base");
import Util = require("./util");
type Data = {
    ID: string;
    data: any;
};



const Base = require("./base");
const Schema = require("./schema");
const Error = require("./err");
const fs = require("fs");
const Util = require("./util");
const chalk = require('chalk');

class db extends Base {

  /**
   * @param {string}
   * @param {string}
   * @param {object}
   */
  constructor(mongodbURL, name, connectionOptions={}) {
      super(mongodbURL || process.env.MONGODB_URL, connectionOptions);

      /**
       * @type {MongooseDocument}
       */
      this.schema = Schema(this.connection, name);
  }

  /**
   * @param {string} key
   * @param {any} value
   * @returns {Promise<any>}
   */
  async init(key, value) {
      if (!Util.isKey(key)) throw new Error("Invalid key specified!", "KeyError");
      if (!Util.isValue(value)) throw new Error("Invalid value specified!", "ValueError");
      const parsed = Util.parseKey(key);
      let raw = await this.schema.findOne({
          ID: parsed.key
      });

      if (!raw) {
            let data = new this.schema({
                ID: parsed.key,
                data: parsed.target ? Util.setData(key, {}, value) : value
            });
            await data.save()
                .catch(e => {
                    return this.emit("error", e);
                });
            return data.data;
        } else {
            raw.data = parsed.target ? Util.setData(key, Object.assign({}, raw.data), value) : value;
            await raw.save()
                .catch(e => {
                    return this.emit("error", e);
                });
            return raw.data;
        }
  }

  /**
   * @param {string} key
  */
  async del(key) {
      if (!Util.isKey(key)) throw new Error("Invalid key specified!", "KeyError");
      const parsed = Util.parseKey(key);
      const raw = await this.schema.findOne({ ID: parsed.key });
      if (!raw) return false;
      if (parsed.target) {
          let data = Util.unsetData(key, Object.assign({}, raw.data));
          if (data === raw.data) return false;
          raw.data = data;
          raw.save().catch(e => this.emit("error", e));
          return true;
      } else {
          await this.schema.findOneAndDelete({ ID: parsed.key })
              .catch(e => {
                  return this.emit("error", e);
              });
          return true;
      }
  }

  /**
   * @param {string} key
   */
  async exists(key) {
      if (!Util.isKey(key)) throw new Error("Invalid key specified!", "KeyError");
      const parsed = Util.parseKey(key);

      let get = await this.schema.findOne({ ID: parsed.key })
          .catch(e => {
              return this.emit("error", e);
          });
      if (!get) return null;
      let item;
      if (parsed.target) item = Util.getData(key, Object.assign({}, get.data));
      else item = get.data;
      return item === undefined ? false : true;
  }

  /**
   * @param {string} key
   */
  async has(key) {
      return await this.exists(key);
  }

  /**
   * @param {string} key
   */
  async get(key) {
      if (!Util.isKey(key)) throw new Error("Invalid key specified!", "KeyError");
      const parsed = Util.parseKey(key);

      let get = await this.schema.findOne({ ID: parsed.key })
          .catch(e => {
              return this.emit("error", e);
          });
      if (!get) return null;
      let item;
      if (parsed.target) item = Util.getData(key, Object.assign({}, get.data));
      else item = get.data;
      return item !== undefined ? item : null;
  }

  /**
   * @param {string} key
   */
  async fetch(key) {
      return this.get(key);
  }

  /**
   * @typedef {object} Data
   * @property {string} ID
   * @property {any} data
   */

  /**
   * @param {number} limit
   */
  async all(limit = 0) {
      if (typeof limit !== "number" || limit < 1) limit = 0;
      let data = await this.schema.find().catch(e => {});
      if (!!limit) data = data.slice(0, limit);

      return data.map(m => ({
          ID: m.ID,
          data: m.data
      }));
  }

  /**
   * @param {number} limit
   */
  async fetchAll(limit) {
      return await this.all(limit);
  }
  async delAll() {
      this.emit(chalk.red("debug", "Deleting everything from the database..."));
      await this.schema.deleteMany().catch(e => {});
      return true;
  }

  /**
   * @param {string} key
   * @param {string} operator
   * @param {number} value
   */
  async math(key, operator, value) {
      if (!Util.isKey(key)) throw new Error("Invalid key specified!", "KeyError");
      if (!operator) throw new Error("No operator provided!");
      if (!Util.isValue(value)) throw new Error("Invalid value specified!", "ValueError");

      switch(operator) {
          case "add":
          case "+":
              let add = await this.get(key);
              if (!add) {
                  return this.init(key, value);
              } else {
                  if (typeof add !== "number") throw new Error(`Expected existing data to be a number, received ${typeof add}!`);
                  return this.init(key, add + value);
              }

          case "subtract":
          case "sub":
          case "-":
              let less = await this.get(key);
              if (!less) {
                  return this.init(key, 0 - value);
              } else {
                  if (typeof less !== "number") throw new Error(`Expected existing data to be a number, received ${typeof less}!`);
                  return this.init(key, less - value);
              }

          case "multiply":
          case "mul":
          case "*":
              let mul = await this.get(key);
              if (!mul) {
                  return this.init(key, 0 * value);
              } else {
                  if (typeof mul !== "number") throw new Error(`Expected existing data to be a number, received ${typeof mul}!`);
                  return this.init(key, mul * value);
              }

          case "divide":
          case "div":
          case "/":
              let div = await this.get(key);
              if (!div) {
                  return this.init(key, 0 / value);
              } else {
                  if (typeof div !== "number") throw new Error(`Expected existing data to be a number, received ${typeof div}!`);
                  return this.init(key, div / value);
              }

          case "mod":
          case "%":
              let mod = await this.get(key);
              if (!mod) {
                  return this.init(key, 0 % value);
              } else {
                  if (typeof mod !== "number") throw new Error(`Expected existing data to be a number, received ${typeof mod}!`);
                  return this.init(key, mod % value);
              }

          default:
              throw new Error("Unknown operator");
      }
  }

  /**
   * @param {string} key
   * @param {number} Value
   */
  async add(key, value) {
      return await this.math(key, "+", value);
  }

  /**
   * @param {string} key
   * @param {number} value
   */
  async subtract(key, value) {
      return await this.math(key, "-", value);
  }

  /**
   * @type {number}
   */
  get uptime() {
      if (!this.readyAt) return 0;
      const timestamp = this.readyAt.getTime();
      return Date.now() - timestamp;
  }

  /**
   * @param {string} fileName
   * @param {string} path
   */
  export(fileName="hive", path="./") {
      return new Promise((resolve, reject) => {
          this.emit("debug", `Exporting database entries to ${path || ""}${fileName}`);
          this.all().then((data) => {
              const strData = JSON.stringify(data);
              if (fileName) {
                  fs.writeFileSync(`${path || ""}${fileName}`, strData);
                  this.emit("debug", `Exported all data!`);
                  return resolve(`${path || ""}${fileName}`);
              }
              return resolve(strData);
          }).catch(reject);
      });
  }

  /**
   * @param {Array} data
   * @param {object} ops
   * @param {boolean}
   * @param {boolean}
   */
  import(data=[], ops = { unique: false, validate: false }) {
      return new Promise(async (resolve, reject) => {
          if (!Array.isArray(data)) return reject(new Error(`Data type must be Array, received ${typeof data}!`, "DataTypeError"));
          if (data.length < 1) return resolve(false);
          if (!ops.unique) {
              this.schema.insertMany(data, { ordered: !ops.validate }, (error) => {
                  if (error) return reject(new Error(`${error}`, "DataImportError"));
                  return resolve(true);
              });
          } else {
              data.forEach((x, i) => {
                  if (!ops.validate && (!x.ID || !x.data)) return;
                  else if (!!ops.validate && (!x.ID || !x.data)) return reject(new Error(`Data is missing ${!x.ID ? "ID" : "data"} path!`, "DataImportError"));
                  setTimeout(() => {
                      this.init(x.ID, x.data);
                  }, 150 * (i + 1));
              });
              return resolve(true);
          }
      });
  }
  disconnect() {
      this.emit("debug", "'database.disconnect()' was called, destroying the process...");
      return this._destroyDatabase();
  }
  connect(url) {
      return this._create(url);
  }
  get name() {
      return this.schema.modelName;
  }
  async _read() {
      let start = Date.now();
      await this.get("LQ==");
      return Date.now() - start;
  }

  async _write() {
      let start = Date.now();
      await this.init("LQ==", Buffer.from(start.toString()).toString("base64"));
      return Date.now() - start;
  }

  /**
   * @typedef {object} DatabaseLatency
   * @property {number} read Read latency
   * @property {number} write Write latency
   * @property {number} average Average latency
   */
  async fetchLatency() {
      let read = await this._read();
      let write = await this._write();
      let average = (read + write) / 2;
      this.delete("LQ==").catch(e => {});
      return { read, write, average };
  }

  async ping() {
      return await this.fetchLatency();
  }

  /**
   * @param {string} key
   * @param {object} ops
   */
  async startsWith(key, ops) {
      if (!key || typeof key !== "string") throw new Error(`Expected key to be a string, received ${typeof key}`);
      let all = await this.all(ops && ops.limit);
      return Util.sort(key, all, ops);
  }

  /**
   * Resolves data type
   * @param {string} key key
   * @example console.log(await db.type("foo"));
   * @returns {Promise<"string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function" | "array">}
   */
  async datatype(key) {
      if (!Util.isKey(key)) throw new Error("Invalid Key!", "KeyError");
      let fetched = await this.get(key);
      if (Array.isArray(fetched)) return "array";
      return typeof fetched;
  }

  /**
   * Returns array of the keys
   * @example const keys = await db.keyarray();
   * console.log(keys);
   * @returns {Promise<string[]>}
   */
  async keyArray() {
      const data = await this.all();
      return data.map(m => m.ID);
  }

  /**
   * Returns array of the values
   * @example const data = await db.valueArray();
   * console.log(data);
   * @returns {Promise<any[]>}
   */
  async valueArray() {
      const data = await this.all();
      return data.map(m => m.data);
  }

  /**
   * Pushes an item into array
   * @param {string} key key
   * @param {any|any[]} value Value to push
   * @example db.push("users", "John"); // -> ["John"]
   * db.push("users", ["Milo", "Simon", "Kyle"]); // -> ["John", "Milo", "Simon", "Kyle"]
   * @returns {Promise<any>}
   */
  async input(key, value) {
      const data = await this.get(key);
      if (data == null) {
          if (!Array.isArray(value)) return await this.init(key, [value]);
          return await this.init(key, value);
      }
      if (!Array.isArray(data)) throw new Error(`Expected target type to be Array, received ${typeof data}!`);
      if (Array.isArray(value)) return await this.init(key, data.concat(value));
      data.push(value);
      return await this.init(key, data);
  }

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
  async pull(key, value, multiple = true) {
      let data = await this.get(key);
      if (data === null) return false;
      if (!Array.isArray(data)) throw new Error(`Expected target type to be Array, received ${typeof data}!`);
      if (Array.isArray(value)) {
          data = data.filter(i => !value.includes(i));
          return await this.init(key, data);
      } else {
          if (!!multiple) {
              data = data.filter(i => i !== value);
              return await this.init(key, data);
          } else {
              const hasItem = data.some(x => x === value);
              if (!hasItem) return false;
              const index = data.findIndex(x => x === value);
              data = data.splice(index, 1);
              return await this.init(key, data);
          }
      }
  }

  /**
   * Returns entries count of current model
   * @returns {Promise<number>}
   * @example const entries = await db.entries();
   * console.log(`There are total ${entries} entries!`);
   */
  async entries() {
      return await this.schema.estimatedDocumentCount();
  }

  /**
   * Returns raw data from current model
   * @param {object} params Search params
   * @returns {Promise<MongooseDocument>}
   * @example const raw = await db.raw();
   * console.log(raw);
   */
  async raw(params) {
      return await this.schema.find(params);
  }

  /**
   * Returns random entry from the database
   * @param {number} n Number entries to return
   * @returns {Promise<any[]>}
   * @example const random = await db.random();
   * console.log(random);
   */
  async random(n = 1) {
      if (typeof n !== "number" || n < 1) n = 1;
      const data = await this.all();
      if (n > data.length) throw new Error("Random value length may not exceed total length.", "RangeError");
      const shuffled = data.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, n);
  }

  /**
   * This method acts like `quick.db#table`. It will return new instance of itself.
   * @param {string} name Model name
   * @returns {Database}
   */
  table(name) {
      if (!name || typeof name !== "string") throw new Error("Invalid model name");
      const CustomModel = new db(this.dbURL, name, this.options);
      return CustomModel;
  }

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
  get utils() {
      return Util;
  }

  /**
   * Updates current model and uses new one
   * @param {string} name model name to use
   * @returns {MongooseDocument}
   */
  updateModel(name) {
      this.schema = Schema(name);
      return this.schema;
  }

  /**
   * String representation of the database
   * @example console.log(db.toString());
   * @returns {string}
   */
  toString() {
      return `Hive<{${this.schema.modelName}}>`;
  }

  /**
   * Allows you to eval code using `this` keyword.
   * @param {string} code
   */
  _eval(code) {
      return eval(code);
  }

}

module.exports = db;

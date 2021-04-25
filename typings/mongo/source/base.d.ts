export = Base;
declare class Base extends EventEmitter {
    /**
     *Mongoose connection base.
     * @param {string} mongodbURL Mongodb Database URL.
     * @param {object} connectionOptions Mongodb connection options
     */
    constructor(mongodbURL: string, connectionOptions?: object);
    /**
     * Mongoose connection options
     * @type {ConnectionOptions}
     */
    options: any;
    /**
     * Returns mongodb connection
     * @type {MongooseConnection}
     */
    connection: any;
    /**
     * Timestamp when database became ready
     * @type {Date}
     */
    readyAt: Date;
    /**
     * Creates mongodb connection
     * @returns {MongooseConnection}
     * @ignore
     */
    _create(url: any): any;
    dbURL: string;
    /**
     * Destroys database
     * @ignore
     */
    _destroyDatabase(): void;
    /**
     * Current database url
     * @type {string}
     */
    get url(): string;
    /**
     * Returns database connection state
     * @type {("DISCONNECTED"|"CONNECTED"|"CONNECTING"|"DISCONNECTING")}
     */
    get state(): "DISCONNECTED" | "CONNECTED" | "CONNECTING" | "DISCONNECTING";
}
import EventEmitter_1 = require("events");
import EventEmitter = EventEmitter_1.EventEmitter;

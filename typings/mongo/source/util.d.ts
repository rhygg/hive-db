export = Util;
declare class Util {
    /**
     * Returns true if provided key is valid
     * @param {any} str Anything to test
     * @returns {boolean}
     */
    static isKey(str: any): boolean;
    /**
     * Returns true if the given data is valid
     * @param {any} data Any data
     * @returns {boolean}
     */
    static isValue(data: any): boolean;
    /**
     * @typedef {object} KEY
     * @property {string | undefined} key Parsed Key
     * @property {string | undefined} target Parsed target
     */
    /**
     * Returns target & key from the given string (quickdb style)
     * @param {string} key key to parse
     * @example Util.parseKey("myitem.items");
     * // -> { key: "myitems", target: "items" }
     * @returns {KEY}
     */
    static parseKey(key: string): KEY;
    /**
     * Sort data
     * @param {string} key Key
     * @param {Array} data Data
     * @param {object} ops options
     * @example Util.sort("user_", {...}, { sort: ".data" });
     * @returns {any[]}
     */
    static sort(key: string, data: any[], ops: object): any[];
    /**
     * Data resolver
     * @param {string} key Data key
     * @param {any} data Data
     * @param {any} value value
     * @example Util.setData("user.items", {...}, ["pen"]);
     * @returns {any}
     */
    static setData(key: string, data: any, value: any): any;
    /**
     * Data resolver
     * @param {string} key Data key
     * @param {any} data Data
     * @param {any} value value
     * @example Util.unsetData("user.items", {...});
     * @returns {any}
     */
    static unsetData(key: string, data: any): any;
    /**
     * Data resolver
     * @param {string} key Key
     * @param {any} data Data
     * @example Util.getData("user.items", {...});
     * @returns {any}
     */
    static getData(key: string, data: any): any;
}
declare namespace Util {
    export { KEY };
}
type KEY = {
    /**
     * Parsed Key
     */
    key: string | undefined;
    /**
     * Parsed target
     */
    target: string | undefined;
};

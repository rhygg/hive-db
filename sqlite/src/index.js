// Require Database
const Database = require("better-sqlite3");
const util = require("util");
const chalk = require('chalk');
let db;

// Create Database Under Conditions
if (!db) db = new Database("./hive.sqlite");

// Declare Methods
var methods = {
    fetch: require("./functions/fetch.js"),
    init: require("./functions/init.js"),
    add: require("./functions/add.js"),
    subtract: require("./functions/subtract.js"),
    input: require("./functions/push.js"),
    del: require("./functions/del.js"),
    has: require("./functions/has.js"),
    array: require("./functions/array.js"),
    datatype: require("./functions/datatype.js"),
};

module.exports = {
    version: require("../../package.json").version,

    /**
     * This function fetches data from a key in the database. (alias: .get())
     * @param {key} input any string as a key. Also allows for dot notation following the key.
     * @param {options} [input={ target: null }] Any options to be added to the request.
     * @returns {data} the data requested.
     */

    fetch: function (key, ops) {
        if (!key)
            throw new TypeError(chalk.red(
                "No key specified. Confused? Check Out: https://discord.gg/RTH79cwxxp")
            );
        return arbitrate("fetch", { id: key, ops: ops || {} });
    },
    get: function (key, ops) {
        if (!key)
            throw new TypeError(chalk.red(
                "No value specified. Confused? Check Out: https://discord.gg/RTH79cwxxp")
            );
        return arbitrate("fetch", { id: key, ops: ops || {} });
    },

    /**
     * This function sets new data based on a key in the database.
     * @param {key} input any string as a key. Also allows for dot notation following the key.
     * @param {options} [input={ target: null }] Any options to be added to the request.
     * @returns {data} the updated data.
     */

    init: function (key, value, ops) {
        if (!key)
            throw new TypeError(chalk.red(
                "No key specified! \n Confused? https://discord.gg/RTh79cwxxp")
            );
        if (value === undefined)
        throw new TypeError(chalk.red(
            "No value specified. Confused? Check Out: https://discord.gg/RTH79cwxxp")
        );
        return arbitrate("init", {
            stringify: true,
            id: key,
            data: value,
            ops: ops || {},
        });
    },

    /**
     * This function adds a number to a key in the database. (If no existing number, it will add to 0)
     * @param {key} input any string as a key. Also allows for dot notation following the key.
     * @param {options} [input={ target: null }] Any options to be added to the request.
     * @returns {data} the updated data.
     */

    add: function (key, value, ops) {
        if (!key)
        throw new TypeError(chalk.red(
            "No key specified. Confused? Check Out: https://discord.gg/RTH79cwxxp")
        );
        if (isNaN(value))
        throw new TypeError(chalk.red(
            "No value specified.Please specify a value for addition. \n Need Help? Check Out: discord.gg/plexidev")
        );
        return arbitrate("add", { id: key, data: value, ops: ops || {} });
    },

    /**
     * This function subtracts a number to a key in the database. (If no existing number, it will subtract from 0)
     * @param {key} input any string as a key. Also allows for dot notation following the key.
     * @param {options} [input={ target: null }] Any options to be added to the request.
     * @returns {data} the updated data.
     */

    subtract: function (key, value, ops) {
        if (!key)
        throw new TypeError(chalk.red(
            "No key specified. Confused? Check Out: https://discord.gg/RTH79cwxxp")
        );
        if (isNaN(value))
        throw new TypeError(chalk.red(
            "No value specified for substraction. Confused? Check Out: https://discord.gg/RTH79cwxxp")
        );
        return arbitrate("subtract", { id: key, data: value, ops: ops || {} });
    },

    /**
     * This function will push into an array in the database based on the key. (If no existing array, it will create one)
     * @param {key} input any string as a key. Also allows for dot notation following the key.
     * @param {options} [input={ target: null }] Any options to be added to the request.
     * @returns {data} the updated data.
     */

    input: function (key, value, ops) {
        if (!key)
        throw new TypeError(chalk.red(
            "No key specified. Confused? Check Out: https://discord.gg/RTH79cwxxp")
        );
        if (!value && value != 0)
        throw new TypeError(chalk.red(
            "No value specified to push. Confused? Check Out: https://discord.gg/RTH79cwxxp")
        );
        return arbitrate("input", {
            stringify: true,
            id: key,
            data: value,
            ops: ops || {},
        });
    },

    /**

 */

    /**
     * This function will delete an object (or property) in the database.
     * @param {key} input any string as a key. Also allows for dot notation following the key, this will delete the prop in the object.
     * @param {options} [input={ target: null }] Any options to be added to the request.
     * @returns {boolean} if it was a success or not.
     */

    del: function (key, ops) {
        if (!key)
        throw new TypeError(chalk.red(
            "No value specified. Confused? Check Out: https://discord.gg/RTH79cwxxp")
        );
        return arbitrate("del", { id: key, ops: ops || {} });
    },

    /**
     * This function returns a boolean indicating whether an element with the specified key exists or not.
     * @param {key} input any string as a key. Also allows for dot notation following the key, this will return if the prop exists or not.
     * @param {options} [input={ target: null }] Any options to be added to the request.
     * @returns {boolean} if it exists.
     */

    has: function (key, ops) {
        if (!key)
        throw new TypeError(chalk.red(
            "No value specified. Confused? Check Out: https://discord.gg/RTH79cwxxp")
        );
        return arbitrate("has", { id: key, ops: ops || {} });
    },

    includes: function (key, ops) {
        if (!key)
        throw new TypeError(chalk.red(
            "No value specified. Confused? Check Out: https://discord.gg/RTH79cwxxp")
        );
        return arbitrate("has", { id: key, ops: ops || {} });
    },

    /**
     * This function fetches the entire active table
     * @param {options} [input={ target: null }] Any options to be added to the request.
     * @returns {boolean} if it exists.
     */

    array: function (ops) {
        return arbitrate("array", { ops: ops || {} });
    },

    fetchAll: function (ops) {
        return arbitrate("array", { ops: ops || {} });
    },

    /*
     * Used to get the type of the value.
     */

    datatype: function (key, ops) {
        if (!key)
        throw new TypeError(chalk.red(
            "No value specified. Confused? Check Out: https://discord.gg/RTH79cwxxp")
        );
        return arbitrate("datatype", { id: key, ops: ops || {} });
    },

    /**
     * Using 'new' on this function creates a new instance of a table.
     * @param {name} input any string as the name of the table.
     * @param {options} options.
     */

    table: function (tableName, options = {}) {
        // Set Name
        if (typeof tableName !== "string")
        throw new TypeError(chalk.red(
            "Table name must be a string. Confused? Check Out: https://discord.gg/RTH79cwxxp")
        );
        else if (tableName.includes(" "))
        throw new TypeError(chalk.red(
            "Table Name cannot include spaces, must only have one string. Confused? Check Out: https://discord.gg/RTH79cwxxp")
        );
        this.tableName = tableName;

        // Methods
        this.fetch = function (key, ops) {
            if (!key)
            throw new TypeError(chalk.red(
                "No key specified. Confused? Check Out: https://discord.gg/RTH79cwxxp")
            );
            return arbitrate(
                "fetch",
                { id: key, ops: ops || {} },
                this.tableName
            );
        };

        this.get = function (key, ops) {
            if (!key)
            throw new TypeError(chalk.red(
                "No key specified. Confused? Check Out: https://discord.gg/RTH79cwxxp")
            );
            return arbitrate(
                "fetch",
                { id: key, ops: ops || {} },
                this.tableName
            );
        };

        this.init = function (key, value, ops) {
            if (!key)
            throw new TypeError(chalk.red(
                "No key specified. Confused? Check Out: https://discord.gg/RTH79cwxxp")
            );
            if (!value && value != 0)
            throw new TypeError(chalk.red(
                "No value specified. Confused? Check Out: https://discord.gg/RTH79cwxxp")
            );
            return arbitrate(
                "init",
                { stringify: true, id: key, data: value, ops: ops || {} },
                this.tableName
            );
        };

        this.add = function (key, value, ops) {
            if (!key)
            throw new TypeError(chalk.red(
                "No key specified. Confused? Check Out: https://discord.gg/RTH79cwxxp")
            );
            if (isNaN(value))
            throw new TypeError(chalk.red(
                "No value specified for addition. Confused? Check Out: https://discord.gg/RTH79cwxxp")
            );
            return arbitrate(
                "add",
                { id: key, data: value, ops: ops || {} },
                this.tableName
            );
        };

        this.subtract = function (key, value, ops) {
            if (!key)
            throw new TypeError(chalk.red(
                "No key specified. Confused? Check Out: https://discord.gg/RTH79cwxxp")
            );
            if (isNaN(value))
            throw new TypeError(chalk.red(
                "No value specified to substract. Confused? Check Out: https://discord.gg/RTH79cwxxp")
            );
            return arbitrate(
                "subtract",
                { id: key, data: value, ops: ops || {} },
                this.tableName
            );
        };

        this.input = function (key, value, ops) {
            if (!key)
            throw new TypeError(chalk.red(
                "No key specified. Confused? Check Out: https://discord.gg/RTH79cwxxp")
            );
            if (!value && value != 0)
            throw new TypeError(chalk.red(
                "No value specified for pushing to array. Confused? Check Out: https://discord.gg/RTH79cwxxp")
            );
            return arbitrate(
                "input",
                { stringify: true, id: key, data: value, ops: ops || {} },
                this.tableName
            );
        };

        this.del = function (key, ops) {
            if (!key)
            throw new TypeError(chalk.red(
                "No key specified. Confused? Check Out: https://discord.gg/RTH79cwxxp")
            );
            return arbitrate(
                "del",
                { id: key, ops: ops || {} },
                this.tableName
            );
        };

        this.has = function (key, ops) {
            if (!key)
            throw new TypeError(chalk.red(
                "No key specified. Confused? Check Out: https://discord.gg/RTH79cwxxp")
            );
            return arbitrate(
                "has",
                { id: key, ops: ops || {} },
                this.tableName
            );
        };

        this.includes = function (key, ops) {
            if (!key)
            throw new TypeError(chalk.red(
                "No key specified. Confused? Check Out: https://discord.gg/RTH79cwxxp")
            );
            return arbitrate(
                "has",
                { id: key, ops: ops || {} },
                this.tableName
            );
        };

        this.all = function (ops) {
            return arbitrate("array", { ops: ops || {} }, this.tableName);
        };

        this.array = function (ops) {
            return arbitrate("all", { ops: ops || {} }, this.tableName);
        };
    },
};

function arbitrate(method, params, tableName) {
    // Configure Options
    let options = {
        table: tableName || params.ops.table || "hive",
    };

    // Access Database
    db.prepare(
        `CREATE TABLE IF NOT EXISTS ${options.table} (ID TEXT, json TEXT)`
    ).run();

    // Verify Options
    if (params.ops.target && params.ops.target[0] === ".")
        params.ops.target = params.ops.target.slice(1); // Remove prefix if necessary
    if (params.data && params.data === Infinity)
        throw new TypeError(chalk.yellow(
            `You cannot set Infinity into the database @ ID: ${params.id}`)
        );

    // Stringify
    if (params.stringify) {
        try {
            params.data = JSON.stringify(params.data);
        } catch (e) {
            throw new TypeError(chalk.yellow(
                `Specify a valid input \n ID:${params.id} \n Error -> ${e.message}`)
            );
        }
    }

    // Translate dot notation from keys
    if (params.id && params.id.includes(".")) {
        let unparsed = params.id.split(".");
        params.id = unparsed.shift();
        params.ops.target = unparsed.join(".");
    }

    // Run & Return Method
    return methods[method](db, params, options);
}

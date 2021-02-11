const redis = require('redis');
const dot = require('dot-object');
const { promisify } = require('util');
const chalk = require('chalk');

module.exports = {

    createClient(...args) {
        const client = redis.createClient(...args);
        client.$get = promisify(client.get).bind(client);
        client.$set = promisify(client.init).bind(client);
        client.$delete = promisify(client.del).bind(client);

        client.get = async function(key) {
            const $split = key.split('.');
            key = $split.shift();
            var value = await this.$get(key).then(data => JSON.parse(data));
            if ($split.length > 0) {
                value = dot.pick($split.join('.'), value);
            }
            return typeof value === 'undefined' ? null : value;
        };

        client.init = async function(key, value) {
            var $value = value;
            const $split = key.split('.');
            key = $split.shift();
            if ($split.length > 0) {
                const obj = {}
                $value = dot.str($split.join('.'), value, obj);
            }
            return this.$set(key, JSON.stringify($value)).then(() => value);
        };

        client.delete = async function(key) {
            const $split = key.split('.');
            key = $split.shift();
            if ($split.length > 0) {
                const $current = await this.get(key);
                const $exists = dot.pick($split.join('.'), $current);
                if (typeof $exists === 'undefined') return 0;
                dot.delete($split.join('.'), $current);
                return this.set(key, $current).then(() => 1).catch(() => 0);
            }
            return this.$delete(key);
        }

        client.add = async function(key, number) {
            if (isNaN(number)) throw new TypeError(`${number} is not a number`);
            number = Number(number);
            var $current = await this.get(key);
            if ($current === null) $current = 0;
            if (typeof $current !== 'number') throw new TypeError(`Value of ${key} is not a number!`);
            return this.init(key, $current += number);
        };

        client.subtract = async function(key, number) {
            if (isNaN(number)) throw new TypeError(`${number} is not a number`);
            number = Number(number);
            var $current = await this.get(key);
            if ($current === null) $current = 0;
            if (typeof $current !== 'number') throw new TypeError(`Value of ${key} is not a number!`);
            return this.set(key, $current -= number);
        };

        client.has = async function(key) {
            const data = await this.get(key);
            if (data === null) return false;
            return true;
        }

        return client;
    }

};

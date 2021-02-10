const hive = require('../index.js');
const db = hive.sqlite;
db.init('foo', 'bar');
console.log(db.get('foo'));
const {database} = hive.mongo;
const mongo = new database("mongodb+srv://wyvern:thebestbot@cluster0.67lsz.mongodb.net", "JSON", { useUnique: true });

mongo.on("ready", () => {
    console.log(`Database has been connected!`);
});

mongo.on("error", console.error);
mongo.on("debug", console.log);
mongo.init("foo", "bar");
mongo.get("foo").then(console.log);

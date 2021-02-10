![hive-db](https://media.discordapp.net/attachments/790866153316679680/807265892408623104/0001-16485206787_20210205_203508_0000-removebg-preview.png?width=455&height=455)
## ChangeLog
**Hive-db now has interactions based on the adapter you choose, so that you can swiftly use the whole module!**
[Wiki for an in-dept guide](https://github.com/Rhydderchc/hive-db/wiki)

# Hive-db

### Hive-db is a persistent modular database to store data with ease, rather than complex structures.

### Adapters
1. `mongodb -> hive.mongo`
2. `sqlite -> hive.sqlite`

### An example of how it looks!
```js
const hive = require('hive-db');
const db = hive.sqlite;
db.init('name',['Lason']);
db.get('name')
// output => Lason

/*
Array Functionality in Hive-db
*/

db.input('name','Tensor')
db.array('name');
// output => Lason, Tensor

```




### Example with a discord.js bot

```js
const Discord = require('discord.js');
const hive = require('hive-db');
const db = hive.sqlite;

 run = async (message, args, client) =>{
 message.channel.send('Enter your name');
 db.init('name', args[0]);
 }

//Trigger function using get.

const Discord = require('discord.js');
const db = require('hive-db');

 run = async (message, args, client) =>{
 message.channel.send('Your name is \t'+db.get('name'));
 }
 /*
 You can do only user based values that are unique for example, to remember
 the name of some users db.init(`name_${message.author.id}`, args[0]), because
 discord user ids are unique, same goes with guild values!
 */
 ```




# Provided Functions as of now

1. Initialize your key and value!
```js
db.init('name',['Lason']);

```
2. Get the value stored in the key!
```js
db.fetch('name')
```
3. Delete a key!
```js
db.del('name')
```
4. Input an element into an array value.
```js
db.input('name','Tensor')
```
5. Subtract a numeric value from a key storing a numeric value
```js
db.subtract('age',1)
// subtracting 21 from 1, where age(key) contains -> 21
```
6.  Subtract a numeric value from a key storing a numeric value
```js
db.add('age',1)
// Adding 1 to 21, where age(key) contains -> 21
```
7. Fetching all elements in an Array
```js
db.array('name')
// output => Tensor, Lason
```
8. Checks if a key stores a `value` or is `null`
```js
db.has('name')
// output => true
```
9. Outputs the datatype of the stored value in a key.
```js
db.datatype('age')
// output => int
```
# Mongo-Db interaction with Hive-db
You can use both localhost and MongoDb altas uri's to connect to mongodb.
Here is an example of its support:-
```js
const db = require('hive-db');
// Point to be noted, database is a constructor under db.mongo
const {database} = db.mongo;
const mongo= new database("mongodb+srv://wyvern:thebestbot@cluster0.67lsz.mongodb.net", "JSON", { useUnique: true });
mongo.on("ready", () => {
    console.log(`Connected!`);
    test();
});
mongo.on("error", console.error);
mongo.on("debug", console.log);
async function test() {
  mongo.init('age','21');
  mongo.get('age')
  //-> 21
  mongo.init('name','Lason');
  mongo.get('name');
  //-> Lason
}
```
Creating Tables using hive-db mongo interaction!
```js
const db = require('hive-db');
const {database} = db.mongo;
const mongo= new database("mongodb+srv://wyvern:thebestbot@cluster0.67lsz.mongodb.net", "JSON", { useUnique: true });
mongo.on("ready", () => {
    console.log(`Connected!`);
    test();
});
mongo.on("error", console.error);
mongo.on("debug", console.log);
async function test() {
  const test = db.table('test');
  test.init('slogan','hive-db is da best!')
  test.get('slogan');
  // output => hive-db is da best
  // while if we use mongo.get('slogan') it won't work!
  mongo.get('slogan');
  // returns null!
}
```
# Mongo Methods

Initialize a value.
```js
mongo.init("foo", "bar");
```
Get a value.
```js
mongo.get("foo").then(console.log);
//-> bar
```
Input a value into an existing array.
```js
mongo.input("name");
// assuming that the key name has an array, for example ["Lason", "Tensor"]
```
Add a value to a data(number) in a key
```js
mongo.add('age', 4)
// adds 4 to the age
```
Subtract a value from a data(number) in a key
```js
mongo.subtract('age', 4)
// subtracts 4 from the age
```
Create data models!
```js
const age = mongo.table('age')
age.init('name', 'Lason')
age.get('name').then(console.log);
// -> Lason!
```
**TIP**
You can use your own data table using a JSON base. Below stats an example using the key, data structure.
```
[
{
"ID":"something",
"data":"something"
}
]
```
Hive-db understands this without any external effort, and you don't even have to call the file anywhere in your code!
```js
db.get("something");
//-> give you something as the output!
```


## [Support Server](https://discord.gg/RTh79cwxxp) | [Documentation](https://hive-db.gitbook.io/docs/)

# Sponsors!

## [BytesToBits](https://discord.gg/bbPmhMMSyC)
![Bytes To Bits](https://media.discordapp.net/attachments/774822256559915048/807614306623553546/BTBLogoColoredHead.png)

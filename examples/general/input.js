// this is how you use hive in a normal javascript program.
/* Reminder,
You may even use this in html5, in the <script> </script> section,
everything works.

*/
let hive = require('hive-db');
let db = hive.sqlite;// using sqlite again, even mongo can be used, this one just eases the example.
var name = window.prompt("Enter your name,:")
alert("Your names are:"+names+" they have been stored inside hive-db!");
db.init("name", [`${name}`]);
var secondname = window.prompt("Enter your friend's name:");
alert("Your friends name is:"+secondname+"And your name was"+name+"Both names have been stored in the database hive-db!");
db.input("name", secondname);
alert(db.get("name")+"haha, I got both your names!");
//-> results in both names!

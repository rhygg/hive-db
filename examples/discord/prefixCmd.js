const hive = require('hive-db');
const db = hive.sqlite;
// starting with sqlite!
// importing modules
const chalk = require('chalk');
const Discord = require('discord.js'),
client = new Discord.Client();

client.on('ready',() =>{
console.log(chalk.yellow('I\'m ready'));
})
client.on('message', () =>{
db.set(`prefix_${message.guild.id}`,'!'); // you can also put message.author.id if you want the prefix to be user specific.
if(message.author.bot) return;
if(!message.guild) return;
const args = message.content.slice(prefix.length).trim().split(' ');;
const prefix = db.get(`prefix_${message.guild.id}`);
if(message.content === `${prefix}ping`){
message.channel.send('Pong');

}
if(message.content === `${prefix}setprefix`){
message.channel.send(`prefix changed to ${args[0]}`);
db.set(`prefix_${message.guild.id}`, args[0]);
}
/* Note,
you can add other types of condition if you want, for example permissions, and argument
characters
this example is just how you can use hive's sqlite interation.
*/
})
client.login("BOT_TOKEN");



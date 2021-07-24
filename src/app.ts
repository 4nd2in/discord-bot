import dotenv from "dotenv";
import Discord from "discord.js";
import fs from "fs";
import { config } from "./config";
import { Command } from "./commands/Command";
import { handleError } from "./helper/handleError";

const client = new Discord.Client();
const commands = new Discord.Collection<string, Command>();

const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".ts"));

for (const file of commandFiles) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const command: Command = require(`./commands/${file}`);
  commands.set(command.name, command);
}
dotenv.config();

client.once("ready", () => {
  console.log("ready");
});

client.on("message", (message) => {
  if (!message.content.startsWith(config.prefix) || message.author.bot) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/);
  const command = args?.shift()?.toLowerCase();

  if (command === undefined) {
    handleError("Given Command is empty.", message);
    return false;
  }
  if (!commands.has(command)) {
    handleError(`Command named ${command} does not exist.`, message);
    return;
  }

  commands?.get(command)?.execute(message, args);
});

client.login(process.env.TOKEN);

import { Collection, Message } from "discord.js";
import fs from "fs";
import { Command } from "src/commands/Command";
import { config } from "src/config";
import { handleError } from "./handleError";

const commands = new Collection<string, Command>();

const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".ts"));

for (const file of commandFiles) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const command: Command = require(`./commands/${file}`);
  commands.set(command.name, command);
}

export const handleOnMessage = (message: Message): void => {
  if (!message.content.startsWith(config.prefix) || message.author.bot) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/);
  const command = args?.shift()?.toLowerCase();

  if (command === undefined) {
    handleError("Given Command is empty.", message);
    return;
  }
  if (!commands.has(command)) {
    handleError(`Command named ${command} does not exist.`, message);
    return;
  }

  commands?.get(command)?.execute(message, args);
};

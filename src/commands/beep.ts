import Discord from "discord.js";
import { Command } from "./Command";

export const beep: Command = {
  name: "beep",
  description: "Relying with 'boop'",
  execute(message: Discord.Message): void {
    message.channel.send("boop");
  },
};

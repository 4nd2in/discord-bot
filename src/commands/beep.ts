import { Message } from "discord.js";
import { Command } from "./Command";

export const beep: Command = {
  name: "beep",
  description: "Relying with 'boop'",
  execute(message: Message): void {
    message.channel.send("boop");
  },
};

import Discord from "discord.js";

export const handleError = (error: string, message: Discord.Message): void => {
  console.error("\x1b[31m", `Error: ${error}`);
  message.reply(error);
};

import { Interaction } from "discord.js";

export const onInteractionCreate = async (
  interaction: Interaction
): Promise<void> => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === "beep") {
    await interaction.reply("boop!");
  }
};

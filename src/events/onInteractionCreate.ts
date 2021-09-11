import { Interaction } from "discord.js";
import { commands } from "../helper/commands.js";

const onInteractionCreate = async (interaction: Interaction): Promise<void> => {
  if (!interaction.isCommand()) return;

  const command = commands.get(interaction.commandName);

  try {
    if (command) await command.execute(interaction);
  } catch (error) {
    console.log(error);
    await interaction.reply({
      content: "Oops, I failed to execute this command. Blame my dev for this!",
      ephemeral: true,
    });
  }
};

export default {
  name: "interactionCreate",
  once: false,
  execute(interaction: Interaction): void {
    onInteractionCreate(interaction);
  },
};

import { SlashCommandBuilder } from "@discordjs/builders";
import { Interaction } from "discord.js";
import { Command } from "src/helper/Command";

export default {
  data: new SlashCommandBuilder()
    .setName("beep")
    .setDescription("Replies with boop!"),
  async execute(interaction: Interaction): Promise<void> {
    if (interaction.isCommand()) await interaction.reply("boop!");
  },
} as Command;

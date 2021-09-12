import { SlashCommandBuilder } from "@discordjs/builders";
import { Interaction, TextChannel } from "discord.js";
import { sequelizeClient } from "src/database/SequelizeClient";
import { Command } from "src/interfaces/Command";

const channelIdKey = "channelId";
const messageIdKey = "messageId";
const reactionKey = "reaction";
const roleIdKey = "roleId";

export default {
  data: new SlashCommandBuilder()
    .setName("addReactionRole")
    .setDescription("Adds a reaction to the given message to manage roles.")
    .addStringOption((option) =>
      option.setName(channelIdKey).setDescription("Enter the message ID")
    )
    .addStringOption((option) =>
      option.setName(messageIdKey).setDescription("Enter the message ID")
    )
    .addStringOption((option) =>
      option.setName(reactionKey).setDescription("Enter the reaction")
    )
    .addStringOption((option) =>
      option.setName(roleIdKey).setDescription("Enter the role ID")
    ),
  async execute(interaction: Interaction): Promise<void> {
    if (interaction.isCommand()) {
      const channelId = interaction.options.getString(channelIdKey);
      const messageId = interaction.options.getString(messageIdKey);
      const reaction = interaction.options.getString(reactionKey);
      const roleId = interaction.options.getString(roleIdKey);

      if (!channelId || !messageId || !reaction || !roleId) {
        await interaction.reply("One of your inputs is not correct, try again");
        return;
      }

      const channel = await interaction?.guild?.channels.fetch(channelId);
      if (!channel || channel?.isText()) {
        await interaction.reply(
          `I can not find a text channel with the id ${channelId} :(`
        );
        return;
      }

      const message = await (channel as TextChannel).messages.fetch(messageId);
      if (!message) {
        await interaction.reply(
          `I can not find a message with the id ${messageId} :(`
        );
        return;
      }

      const role = await interaction?.guild?.roles.fetch(roleId);
      if (!role) {
        await interaction.reply(
          `I can not find a role with the id ${roleId} :(`
        );
        return;
      }

      // TODO: create objects and validate, then add reaction

      try {
        await sequelizeClient.models.ReactionRoles.create({
          channel: channelId,
          message: messageId,
          reaction: reaction,
          role: roleId,
        });
      } catch (error) {
        await interaction.reply(
          "Oops, something went wrong on my side, sqlite can be quiet a challenge!"
        );
        return;
      }

      await interaction.reply("I successfully added your reaction role :D");
    }
  },
} as Command;

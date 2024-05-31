import { CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "../interfaces/Command";
import { en } from "../locales/en";

const ping: Command = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription(en.pongDesc),
    run: async (interaction: CommandInteraction<CacheType>) => {
        await interaction.reply(en.replyPong).catch(console.error);
        console.info(`Sent to channel ${interaction?.channel?.id}`);
    }
};

export { ping as command };

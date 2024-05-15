import { CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "../interfaces/Command";

const ping: Command = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Simple command to test if the bot is responding to interactions."),
    run: async (interaction: CommandInteraction<CacheType>) => {
        await interaction.reply("pong!").catch(console.error);
        console.info(`Sent 'pong!' to channel ${interaction?.channel?.id}`);
    }
};

export { ping as command };

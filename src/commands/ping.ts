import { CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "../interfaces/command";

const ping: Command = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with pong!"),
    run: async (interaction: CommandInteraction<CacheType>) => {
        await interaction.reply("pong!");
        console.info(`Sent 'pong!' to channel ${interaction?.channel?.id}`);
    }
};

export { ping as command };

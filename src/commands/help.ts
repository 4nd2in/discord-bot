import {
    ApplicationCommandData,
    ApplicationCommandDataResolvable,
    CacheType,
    CommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder
} from "discord.js";
import { bot } from "..";
import { Command } from "../interfaces/Command";

const help: Command = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Shows the description of all commands"),
    run: async (interaction: CommandInteraction<CacheType>) => {
        const helpResponse = new EmbedBuilder()
            .setTitle("Command List")
            .setDescription("Description of all commands")
            .setColor("#00FF00");

        const fields = bot.slashCommands
            .filter(isHelpData)
            .map(command => ({
                name: `**${command.name.toUpperCase()}**`,
                value: `${command.description}`,
                inline: false
            }));
        helpResponse.addFields(fields);

        helpResponse.setTimestamp();
        interaction.reply({ embeds: [helpResponse] }).catch(console.error);
    }
};

type ApplicationCommandHelpData = ApplicationCommandData & { description: string }
function isHelpData(
    command: ApplicationCommandDataResolvable
): command is ApplicationCommandHelpData {
    return "name" in command && "description" in command;
}

export { help as command };

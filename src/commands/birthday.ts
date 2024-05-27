import {
    CacheType,
    ChatInputCommandInteraction,
    CommandInteraction,
    CommandInteractionOptionResolver,
    EmbedBuilder,
    SlashCommandBuilder
} from "discord.js";
import { db } from "../db/db";
import { Birthday } from "../interfaces/Birthday";
import { Command } from "../interfaces/Command";

const birthday: Command = {
    data: new SlashCommandBuilder()
        .setName("birthday")
        .setDescription("Handle birthdays")
        .addSubcommand(subcommand =>
            subcommand
                .setName("add")
                .setDescription("Adds a user to birthday list.")
                .addUserOption(option =>
                    option
                        .setName("user")
                        .setDescription("User from whom you want to add the birthday.")
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName("date")
                        .setDescription("Date of birthday {YYYY-MM-DD}.")
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("show")
                .setDescription("Displays a users birthday or all if no user is mentioned.")
                .addUserOption(option =>
                    option
                        .setName("user")
                        .setDescription("User from whom you want to see the birthday.")
                        .setRequired(false)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("remove")
                .setDescription("Removes a user from birthday list.")
                .addUserOption(option =>
                    option
                        .setName("user")
                        .setDescription("User from whom you want to delete the birthday.")
                        .setRequired(true)
                )
        ),
    run: async (interaction: CommandInteraction<CacheType>) => {
        const options = (interaction as ChatInputCommandInteraction).options;
        if (options.getSubcommand() === "add")
            await handleAdd(interaction, options);
        if (options.getSubcommand() === "show")
            await handleShow(interaction, options);
        if (options.getSubcommand() === "remove")
            await handleRemove(interaction, options);
    }
};

const handleAdd = async (
    interaction: CommandInteraction,
    options: Omit<CommandInteractionOptionResolver<CacheType>, "getMessage" | "getFocused">
) => {
    const user = options.getUser("user");
    const date = options.getString("date");

    if (!date) {
        await interaction.reply("Please enter a real date").catch(console.error);
        return;
    }

    if (!user) {
        await interaction.reply("Could not find user").catch(console.error);
        return;
    }

    try {
        const parsedDate = new Date(date);
        const age = calculateAge(parsedDate);

        const birthday: Birthday = {
            id: user.id,
            username: user.displayName,
            date: parsedDate
        };
        await db.push(`/${interaction.guildId}/birthdays[]`, birthday);

        await interaction.reply(
            `Added birthday for ${user.displayName}, age: ${age}`
        ).catch(console.error);
    } catch (error) {
        console.error(error);
        await interaction.reply("Please enter a real date").catch(console.error);
    }
};

const calculateAge = (birthdate: Date): number => {
    const today = new Date();

    let age = today.getFullYear() - birthdate.getFullYear();
    const monthDifference = today.getMonth() - birthdate.getMonth();
    const dayDifference = today.getDate() - birthdate.getDate();

    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
        age--;
    }

    return age;
};

const handleShow = async (
    interaction: CommandInteraction,
    options: Omit<CommandInteractionOptionResolver<CacheType>, "getMessage" | "getFocused">
) => {
    const user = options.getUser("user");
    if (user) {
        const index = await db.getIndex(`/${interaction.guildId}/birthdays`, user.id)
            .catch(console.error);

        if (index === -1) {
            await interaction.reply(`Could not find birthday of ${user.displayName}`)
                .catch(console.error);
            return;
        }

        const birthday = await db
            .getObjectDefault<Birthday>(`/${interaction.guildId}/birthdays[${index}]`, undefined);

        if (!birthday) {
            await interaction.reply(`Could not find birthday of ${user.displayName}`)
                .catch(console.error);
            return;
        }

        await interaction
            .reply(`Brithday of ${user.displayName} is ${birthday.date.toLocaleDateString()}. They are ${calculateAge(birthday.date)} years old 🎂`)
            .catch(console.error)
            ;
    } else {
        const birthdays = await db
            .getObjectDefault<Array<Birthday>>(`/${interaction.guildId}/birthdays`, []);

        if (birthdays.length === 0) {
            await interaction.reply("My database is currently empty :(").catch(console.error);
            return;
        }

        const response = new EmbedBuilder()
            .setTitle("Birthday List")
            .setColor("#00FF00");

        const fields = birthdays.map(birthday => (
            {
                name: `**${birthday.username}**`,
                value: `Age: ${calculateAge(birthday.date)}, Birthday: ${birthday.date.toLocaleDateString()}`,
                inline: false
            }
        ));
        response.addFields(fields);

        response.setTimestamp();
        interaction.reply({ embeds: [response] }).catch(console.error);
    }
};

const handleRemove = async (
    interaction: CommandInteraction,
    options: Omit<CommandInteractionOptionResolver<CacheType>, "getMessage" | "getFocused">
) => {
    const user = options.getUser("user");
    if (!user) {
        await interaction.reply("Could not find user").catch(console.error);
        return;
    }

    const index = await db.getIndex(`/${interaction.guildId}/birthdays`, user.id)
        .catch(console.error);
    await db.delete(`/${interaction.guildId}/birthdays[${index}]`).catch(console.error);
    await interaction.reply(`Removed ${user.displayName} from birthday list.`)
        .catch(console.error);
};

export { birthday as command };

import {
    CacheType,
    ChannelType,
    ChatInputCommandInteraction,
    CommandInteraction,
    CommandInteractionOptionResolver,
    EmbedBuilder,
    SlashCommandBuilder
} from "discord.js";
import { addBirthday, deleteBirthdayOfUser, getBirthdayOfUser, getBirthdaysOfGuild, setBirthdayResponseChannel } from "../db/helper/birthdaysHelper";
import { Birthday } from "../interfaces/Birthday";
import { Command } from "../interfaces/Command";
import { createBirthdayJob } from "../jobs/birthdayJob";
import { calculateAge } from "../utils/birthdayUtil";

const birthday: Command = {
    data: new SlashCommandBuilder()
        .setName("birthday")
        .setDescription("Handle birthdays")
        .addSubcommand(subcommand =>
            subcommand
                .setName("set_channel")
                .setDescription("Sets the channel to which notifications are being sent. If unset, no message will be sent.")
                .addChannelOption(option =>
                    option
                        .setName("channel")
                        .setDescription("Channel to send congratulations to.")
                        .setRequired(true)
                )
        )
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
        switch (options.getSubcommand()) {
            case "set_channel":
                return await handleSetChannel(interaction, options);
            case "add":
                return await handleAdd(interaction, options);
            case "show":
                return await handleShow(interaction, options);
            case "remove":
                return await handleRemove(interaction, options);
            default:
                await interaction.reply("I don't know this command :(");
        }
    }
};

const handleSetChannel = async (
    interaction: CommandInteraction,
    options: Omit<CommandInteractionOptionResolver<CacheType>, "getMessage" | "getFocused">
) => {
    const channel = options.getChannel("channel");

    if (!channel || channel.type != ChannelType.GuildText) {
        await interaction.reply("Please enter a text channel").catch(console.error);
        return;
    }

    if (!interaction.guildId) {
        await interaction.reply("Could not find guild").catch(console.error);
        return;
    }

    await setBirthdayResponseChannel(interaction.guildId, channel.id);
    await interaction.reply(`Set <#${channel.id}> as birthday response channel`);
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

    if (!interaction.guildId) {
        await interaction.reply("Could not find guild").catch(console.error);
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
        await addBirthday(interaction.guildId, birthday);
        const job = createBirthdayJob(interaction.guildId, birthday);
        job.start()

        await interaction.reply(
            `Added birthday for ${user.displayName}, age: ${age}`
        ).catch(console.error);
    } catch (error) {
        console.error(error);
        await interaction.reply("Please enter a real date").catch(console.error);
    }
};

const handleShow = async (
    interaction: CommandInteraction,
    options: Omit<CommandInteractionOptionResolver<CacheType>, "getMessage" | "getFocused">
) => {
    const user = options.getUser("user");

    if (!interaction.guildId) {
        await interaction.reply("Could not find guild").catch(console.error);
        return;
    }

    if (user) {
        const birthday = await getBirthdayOfUser(interaction.guildId, user.id);

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
        const birthdays = await getBirthdaysOfGuild(interaction.guildId);

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

    if (!interaction.guildId) {
        await interaction.reply("Could not find guild").catch(console.error);
        return;
    }

    await deleteBirthdayOfUser(interaction.guildId, user.id);
    await interaction.reply(`Removed ${user.displayName} from birthday list.`)
        .catch(console.error);
};

export { birthday as command };

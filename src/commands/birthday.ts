import {
    CacheType,
    ChannelType,
    ChatInputCommandInteraction,
    CommandInteraction,
    CommandInteractionOptionResolver,
    EmbedBuilder,
    SlashCommandBuilder
} from "discord.js";
import { bot } from "..";
import {
    dbAddBirthday,
    dbDeleteBirthdayOfUser,
    dbGetBirthdayOfUser,
    dbGetBirthdaysOfGuild,
    dbSetBirthdayResponseChannel
} from "../db/helper/birthdaysHelper";
import { dbAddJob, dbDeleteJob } from "../db/helper/jobsHelper";
import { Birthday } from "../interfaces/Birthday";
import { Command } from "../interfaces/Command";
import { createBirthdayJob } from "../jobs/createBirthdayJob";
import { en } from "../locales/en";
import { calculateAge } from "../utils/birthdayUtil";

const birthday: Command = {
    data: new SlashCommandBuilder()
        .setName("birthday")
        .setDescription(en.handleBirthday)
        .addSubcommand(subcommand =>
            subcommand
                .setName("set_channel")
                .setDescription(en.setChannelDesc)
                .addChannelOption(option =>
                    option
                        .setName("channel")
                        .setDescription(en.setChannelDesc)
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("add")
                .setDescription(en.birthdayAddDesc)
                .addUserOption(option =>
                    option
                        .setName("user")
                        .setDescription(en.birthdayAddUserDesc)
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName("date")
                        .setDescription(en.birthdayAddDateDesc)
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("show")
                .setDescription(en.birthdayShowDesc)
                .addUserOption(option =>
                    option
                        .setName("user")
                        .setDescription(en.birthdayShowUserDesc)
                        .setRequired(false)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("remove")
                .setDescription(en.birthdayRemoveDesc)
                .addUserOption(option =>
                    option
                        .setName("user")
                        .setDescription(en.birthdayRemoveUserDesc)
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
        await interaction.reply(en.replyEnterChannel).catch(console.error);
        return;
    }

    if (!interaction.guildId) {
        await interaction.reply(en.replyNoGuild).catch(console.error);
        return;
    }

    await dbSetBirthdayResponseChannel(interaction.guildId, channel.id);
    await interaction.reply(en.replySetChannel(channel.id));
};

const handleAdd = async (
    interaction: CommandInteraction,
    options: Omit<CommandInteractionOptionResolver<CacheType>, "getMessage" | "getFocused">
) => {
    const user = options.getUser("user");
    const date = options.getString("date");

    if (!date) {
        await interaction.reply(en.replyDateInvalid).catch(console.error);
        return;
    }

    if (!user) {
        await interaction.reply(en.replyNoUser).catch(console.error);
        return;
    }

    if (!interaction.guildId) {
        await interaction.reply(en.replyNoGuild).catch(console.error);
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
        await dbAddBirthday(interaction.guildId, birthday);
        const jobData = createBirthdayJob(interaction.guildId, birthday);
        await dbAddJob(jobData);
        bot.startJob(jobData);

        await interaction.reply(en.replyBirthday(user.displayName, age)).catch(console.error);
    } catch (error) {
        console.error(error);
        await interaction.reply(en.replyDateInvalid).catch(console.error);
    }
};

const handleShow = async (
    interaction: CommandInteraction,
    options: Omit<CommandInteractionOptionResolver<CacheType>, "getMessage" | "getFocused">
) => {
    const user = options.getUser("user");

    if (!interaction.guildId) {
        await interaction.reply(en.replyNoGuild).catch(console.error);
        return;
    }

    if (user) {
        const birthday = await dbGetBirthdayOfUser(interaction.guildId, user.id);

        if (!birthday) {
            await interaction.reply(en.replyNoBirthday(user.displayName))
                .catch(console.error);
            return;
        }

        await interaction
            .reply(en.replyHappyBirthday(
                user.displayName,
                birthday.date.toLocaleDateString(),
                calculateAge(birthday.date))
            )
            .catch(console.error);
    } else {
        const birthdays = await dbGetBirthdaysOfGuild(interaction.guildId);

        if (birthdays.length === 0) {
            await interaction.reply(en.replyNoBirthdays).catch(console.error);
            return;
        }

        const response = new EmbedBuilder()
            .setTitle("Birthday List")
            .setColor("#00FF00");

        const fields = birthdays.map(birthday => (
            {
                name: `**${birthday.username}**`,
                value: en.birthdayInfo(
                    calculateAge(birthday.date),
                    birthday.date.toLocaleDateString())
                ,
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
        await interaction.reply(en.replyNoUser).catch(console.error);
        return;
    }

    if (!interaction.guildId) {
        await interaction.reply(en.replyNoGuild).catch(console.error);
        return;
    }

    await dbDeleteBirthdayOfUser(interaction.guildId, user.id);
    await bot.stopJob(user.id);
    await dbDeleteJob(user.id);
    await interaction.reply(en.replyRemoveBirthday(user.displayName))
        .catch(console.error);
};

export { birthday as command };

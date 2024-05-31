import { Birthday } from "../../interfaces/Birthday";
import { dbCreateOrUpdateGuild, dbGetGuild } from "./guildsHelper";

export const dbSetBirthdayResponseChannel = async (guildId: string, channelId: string) => {
    const guild = await dbGetGuild(guildId);
    guild.settings.birthdayResponseChannel = channelId;
    await dbCreateOrUpdateGuild(guild);
};

export const dbAddBirthday = async (guildId: string, birthday: Birthday) => {
    const guild = await dbGetGuild(guildId);
    const filtered = guild.birthdays.filter(bday => bday.id !== birthday.id);
    filtered.push(birthday);
    guild.birthdays = filtered;
    await dbCreateOrUpdateGuild(guild);
};

export const dbGetBirthdayOfUser = async (guildId: string, userId: string): Promise<Birthday | undefined> => {
    const guild = await dbGetGuild(guildId);
    return guild.birthdays.find(bday => bday.id === userId);
};

export const dbGetBirthdaysOfGuild = async (guildId: string): Promise<Birthday[]> => {
    const guild = await dbGetGuild(guildId);
    return guild.birthdays;
};

export const dbDeleteBirthdayOfUser = async (guildId: string, userId: string) => {
    const guild = await dbGetGuild(guildId);
    const filtered = guild.birthdays.filter(bday => bday.id !== userId);
    guild.birthdays = filtered;
    await dbCreateOrUpdateGuild(guild);
};

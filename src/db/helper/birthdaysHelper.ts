import { Birthday } from "../../interfaces/Birthday";
import { db } from "../db";

export const setBirthdayResponseChannel = async (guildId: string, channelId: string) => {
    await db
        .push(`/${guildId}/settings/birthdayResponseChannel`, channelId)
        .catch(console.error);
};

export const getBirthdayResponseChannel = async (guildId: string): Promise<string> => {
    return await db.getObjectDefault<string>(`/${guildId}/settings/birthdayResponseChannel`, undefined);
};

export const addBirthday = async (guildId: string, birthday: Birthday) => {
    await db
        .push(`/${guildId}/birthdays[]`, birthday)
        .catch(console.error);
};

export const getBirthdayOfUser = async (guildId: string, userId: string): Promise<Birthday | undefined> => {
    const index = await db.getIndex(`/${guildId}/birthdays`, userId).catch(console.error);

    if (index === -1) return undefined;

    return await db.getObjectDefault<Birthday>(`/${guildId}/birthdays[${index}]`, undefined);
};

export const getBirthdaysOfGuild = async (guildId: string): Promise<Birthday[]> => {
    return await db.getObjectDefault<Array<Birthday>>(`/${guildId}/birthdays`, []);
};

export const deleteBirthdayOfUser = async (guildId: string, userId: string) => {
    const index = await db
        .getIndex(`/${guildId}/birthdays`, userId)
        .catch(console.error);
    await db
        .delete(`/${guildId}/birthdays[${index}]`)
        .catch(console.error);
};

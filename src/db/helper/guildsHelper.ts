import { JoinedGuild } from "../../interfaces/JoinedGuild";
import { db } from "../db";

export const dbCreateOrUpdateGuild = async (guild: JoinedGuild) => {
    const oldGuildIndex = await db.getIndex("/guilds", guild.id).catch(console.error);

    if (oldGuildIndex === -1) {
        await db.push("/guilds[]", guild).catch(console.error);
    } else {
        await db.push(`/guilds[${oldGuildIndex}]`, guild).catch(console.error);
    }
};

export const dbGetGuilds = async (): Promise<JoinedGuild[]> => {
    return await db.getObjectDefault<JoinedGuild[]>("/guilds", []);
};

export const dbGetGuild = async (guildId: string): Promise<JoinedGuild> => {
    const index = await db.getIndex("/guilds", guildId).catch(console.error);
    return await db.getObjectDefault<JoinedGuild>(`/guilds[${index}]`);
};

export const dbDeleteGuild = async (guildId: string) => {
    const index = await db.getIndex("/guilds", guildId).catch(console.error);
    await db.delete(`/guilds[${index}]`).catch(console.error);
};

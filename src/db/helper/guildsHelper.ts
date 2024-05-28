import { SlimGuild } from "../../interfaces/SlimGuild";
import { db } from "../db";

export const setGuild = async (guild: SlimGuild) => {
    db.push("/guilds[]", guild).catch(console.error);
};

export const getGuilds = async (): Promise<SlimGuild[]> => {
    return db.getObjectDefault<SlimGuild[]>("/guilds", []);
};

export const deleteGuild = async (guildId: string) => {
    const index = await db.getIndex("/guilds", guildId).catch(console.error);
    await db.delete(`/guilds[${index}]`).catch(console.error);
};

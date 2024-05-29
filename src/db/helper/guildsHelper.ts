import { SlimGuild } from "../../interfaces/SlimGuild";
import { db } from "../db";

export const dbAddGuild = async (guild: SlimGuild) => {
    db.push("/guilds[]", guild).catch(console.error);
};

export const dbGetGuilds = async (): Promise<SlimGuild[]> => {
    return db.getObjectDefault<SlimGuild[]>("/guilds", []);
};

export const dbDeleteGuild = async (guildId: string) => {
    const index = await db.getIndex("/guilds", guildId).catch(console.error);
    await db.delete(`/guilds[${index}]`).catch(console.error);
};

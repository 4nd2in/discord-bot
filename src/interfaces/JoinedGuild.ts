import { Birthday } from "./Birthday";
import { GuildSettings } from "./GuildSettings";

export interface JoinedGuild {
    id: string,
    name: string,
    birthdays: Birthday[],
    settings: GuildSettings
}

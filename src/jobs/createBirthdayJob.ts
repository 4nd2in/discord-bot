import { TextChannel } from "discord.js";
import { bot } from "..";
import { dbGetBirthdayResponseChannel } from "../db/helper/birthdaysHelper";
import { Birthday } from "../interfaces/Birthday";
import { CronJobData } from "../interfaces/CronJobData";
import { calculateAge } from "../utils/birthdayUtil";

export const createBirthdayJob = (guildId: string, birthday: Birthday): CronJobData => {
    return {
        id: birthday.id,
        data: {
            // js date month range is 0-11 so we have to add 1
            // cron: second, minute, hour, day of month, month, day of week
            cronTime: `* * * ${birthday.date.getDate()} ${birthday.date.getMonth() + 1} *`,
            onTick: async () => {
                const channelId = await dbGetBirthdayResponseChannel(guildId);
                if (channelId) {
                    const channel = await bot.client.channels
                        .fetch(channelId)
                        .catch(console.error) as TextChannel;
                    channel.send(`<@${birthday.id}> gets ${calculateAge(birthday.date)} today 🎂 Happy Birthday 🥳`);
                } else {
                    console.warn(`guild ${guildId} did not specify a birthday channel but added a birthday.`);
                }
            },
            start: false // autostart
        }
    };
};

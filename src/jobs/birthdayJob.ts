import { CronJob } from "cron";
import { TextChannel } from "discord.js";
import { bot } from "..";
import { getBirthdayResponseChannel } from "../db/helper/birthdaysHelper";
import { Birthday } from "../interfaces/Birthday";
import { calculateAge } from "../utils/birthdayUtil";

export const createBirthdayJob = (guildId: string, birthday: Birthday): CronJob => {
    console.debug(`Adding birthday job -> guild: ${guildId}, birthday: ${birthday}`);
    const jobData = {
        // js date month range is 0-11 so we have to add 1
        // cron: second, minute, hour, day of month, month, day of week
        cronTime: `0 0 8 ${birthday.date.getDate()} ${birthday.date.getMonth() + 1} *`,
        onTick: async () => {
            const channelId = await getBirthdayResponseChannel(guildId);
            if (channelId) {
                const channel = await bot.client.channels
                    .fetch(channelId)
                    .catch(console.error) as TextChannel;
                channel.send(`<@${birthday.id}> gets ${calculateAge(birthday.date)} today 🎂 Happy Birthday 🥳`);
            } else {
                console.warn(`guild ${guildId} did not specify a birthday channel but added a birthday.`);
            }
        },
        start: true
    }

    return CronJob.from(jobData);;
};

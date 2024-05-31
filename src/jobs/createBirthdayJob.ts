import { Birthday } from "../interfaces/Birthday";
import { CronJobData } from "../interfaces/CronJobData";
import { calculateAge } from "../utils/birthdayUtil";

export const createBirthdayJob = (guildId: string, birthday: Birthday): CronJobData => {
    console.debug(guildId);
    return {
        id: birthday.id,
        // js date month range is 0-11 so we have to add 1
        // cron: second, minute, hour, day of month, month, day of week
        cronTime: `0 0 8 ${birthday.date.getDate()} ${birthday.date.getMonth() + 1} *`,
        onTick: `
        // THIS GETS EXECUTED IN BOT SCOPE, NEEDS TO BE JS NOT TS
        async () => {
            const guildsHelper = require("../db/helper/guildsHelper");
            const guild = await guildsHelper.dbGetGuild(${guildId});
            const channelId = guild.settings.birthdayResponseChannel
            if (channelId) {
                const channel = await this.client.channels
                    .fetch(channelId)
                    .catch(console.error);
                channel.send(
                \`<@${birthday.id}> gets ${calculateAge(birthday.date)} today 🎂 Happy Birthday 🥳\`
                );
            } else {
                console.warn(
                \`guild ${guildId} did not specify a birthday channel but added a birthday.\`
                );
            }
        }
        `
    };
};

import { CronJob } from "cron";
import {
    ApplicationCommandDataResolvable,
    Client,
    Collection,
    Events,
    Interaction,
    REST,
    Routes
} from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";
import { config } from "../config";
import { dbAddGuild, dbDeleteGuild, dbGetGuilds } from "../db/helper/guildsHelper";
import { dbGetJobs } from "../db/helper/jobsHelper";
import { Command } from "../interfaces/Command";
import { CronJobData } from "../interfaces/CronJobData";

export class Bot {
    slashCommands = new Array<ApplicationCommandDataResolvable>();
    slashCommandsMap = new Collection<string, Command>();
    activeJobsMap = new Collection<string, CronJob>();

    constructor(public readonly client: Client) {
        client.login(config.token);

        this.onReady();
        this.onGuildCreate();
        this.onGuildDelete();
        this.onInteractionCreate();

        client.on(Events.Warn, (info) => console.warn(info));
        client.on(Events.Error, console.error);
    }

    async startJob(jobData: CronJobData) {
        const job = CronJob.from(jobData.data);
        job.start();
        this.activeJobsMap.set(jobData.id, job);
        console.debug(`Started job ${jobData.id} running: ${job.running}`);
    }

    async stopJob(id: string) {
        const job = this.activeJobsMap.get(id);
        job?.stop();
        this.activeJobsMap.delete(id);
        console.debug("Stopped job:", id);
    }

    private async onReady() {
        this.client.once(Events.ClientReady, async () => {
            this.registerSlashCommand();
            this.initiateJobs();
            const guilds = await dbGetGuilds();
            console.info("Guilds:");
            guilds.forEach((guild) => console.info(guild));
            console.info(`${this.client.user!.username} ready!`);
        });
    }

    private async registerSlashCommand() {
        const rest = new REST({ version: "10" }).setToken(config.token);
        const commandFiles = readdirSync(join(__dirname, "..", "commands"));

        for (const file of commandFiles) {
            const imported = await import(join(__dirname, "..", "commands", `${file}`));
            this.slashCommands.push(imported.command.data);
            this.slashCommandsMap.set(imported.command.data.name, imported.command);
        }

        await rest
            .put(Routes.applicationCommands(this.client.user!.id), { body: this.slashCommands })
            .catch(console.error);
    }

    private async initiateJobs() {
        const jobData = await dbGetJobs();
        console.debug("Jobs list:", jobData);
        jobData.forEach(data => {
            this.startJob(data);
        });
    }

    private async onInteractionCreate() {
        this.client.on(Events.InteractionCreate, async (interaction: Interaction) => {
            console.info("Handling incoming interaction");
            if (interaction.isCommand()) {
                const command = this.slashCommandsMap.get(interaction.commandName);
                await command?.run(interaction);
            }
        });
    }

    private async onGuildCreate() {
        this.client.on(Events.GuildCreate, async (guild) => {
            console.info(`Entered new guild: ${guild.id}`);
            const slimGuild = { id: guild.id, name: guild.name };
            await dbAddGuild(slimGuild);
        });
    }

    private async onGuildDelete() {
        this.client.on(Events.GuildDelete, async (guild) => {
            console.info(`Deleted from guild: ${guild.id}`);
            await dbDeleteGuild(guild.id);
        });
    }
};

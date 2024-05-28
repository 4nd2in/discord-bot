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
import { deleteGuild, getGuilds, setGuild } from "../db/helper/guildsHelper";
import { Command } from "../interfaces/Command";

export class Bot {
    slashCommands = new Array<ApplicationCommandDataResolvable>();
    slashCommandsMap = new Collection<string, Command>();

    constructor(public readonly client: Client) {
        client.login(config.token);

        this.onReady();
        this.onGuildCreate();
        this.onGuildDelete();
        this.onInteractionCreate();

        client.on(Events.Warn, (info) => console.warn(info));
        client.on(Events.Error, console.error);
    }

    private async onReady() {
        this.client.once(Events.ClientReady, async () => {
            this.registerSlashCommand();
            const guilds = await getGuilds();
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
            await setGuild(slimGuild);
        });
    }

    private async onGuildDelete() {
        this.client.on(Events.GuildDelete, async (guild) => {
            console.info(`Deleted from guild: ${guild.id}`);
            await deleteGuild(guild.id);
        });
    }
};

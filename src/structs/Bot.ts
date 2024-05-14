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
import config from "../config";
import { Command } from "../interfaces/command";

export class Bot {
    slashCommands = new Array<ApplicationCommandDataResolvable>();
    slashCommandsMap = new Collection<string, Command>();
    private guildIds = new Array<string>;

    constructor(public readonly client: Client) {
        client.login(config.token);
        client.once(Events.ClientReady, () => {
            console.info(`${client.user!.username} ready!`);
            this.registerSlashCommand();
        });

        client.on(Events.Warn, (info) => console.warn(info));
        client.on(Events.Error, console.error);

        this.onInteractionCreate();
    }

    private async registerSlashCommand() {
        const rest = new REST({ version: "9" }).setToken(config.token);
        const commandFiles = readdirSync(join(__dirname, "..", "commands"))
            .filter((file) => !file.endsWith(".map"));

        for (const file of commandFiles) {
            const imported = await import(join(__dirname, "..", "commands", `${file}`));
            this.slashCommands.push(imported.command.data);
            this.slashCommandsMap.set(imported.command.data.name, imported.command);
        }

        for (const guildId in this.guildIds) {
            await rest.put(
                Routes.applicationGuildCommands(this.client.user?.id || "missing id", guildId),
                { body: this.slashCommands }
            );
        }
    }

    private async onInteractionCreate() {
        this.client.on(Events.InteractionCreate, async (interaction: Interaction) => {
            if (interaction.isCommand()) {
                const command = this.slashCommandsMap.get(interaction.commandName);
                await command?.run(interaction);
            }
        });
    }
};

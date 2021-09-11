import dotenv from "dotenv";
import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { config } from "../config.js";

dotenv.config();
const token = process.env.TOKEN ? process.env.TOKEN : "";

const commands = [
  new SlashCommandBuilder()
    .setName("beep")
    .setDescription("Replies with boop!"),
].map((command) => command.toJSON());

const rest = new REST({ version: "9" }).setToken(token);

(async (): Promise<void> => {
  try {
    await rest.put(
      Routes.applicationGuildCommands(config.clientId, config.guildId),
      {
        body: commands,
      }
    );

    console.log("Successfully registered application commands.");
  } catch (error) {
    console.error(error);
  }
})();

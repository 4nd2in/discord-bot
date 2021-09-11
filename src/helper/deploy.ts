import dotenv from "dotenv";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { config } from "../config.js";
import { commands } from "./commands.js";

dotenv.config();
if (process.env.TOKEN) {
  const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);
  (async (): Promise<void> => {
    try {
      await rest.put(
        Routes.applicationGuildCommands(config.clientId, config.guildId),
        {
          body: commands.map((command) => command.data.toJSON()),
        }
      );

      console.log("Successfully registered application commands.");
    } catch (error) {
      console.error(error);
    }
  })();
}

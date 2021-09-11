import dotenv from "dotenv";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { commands } from "./commands.js";

dotenv.config();
if (process.env.TOKEN && process.env.CLIENT && process.env.GUILD) {
  const token = process.env.TOKEN;
  const client = process.env.CLIENT;
  const guild = process.env.GUILD;

  const rest = new REST({ version: "9" }).setToken(token);
  (async (): Promise<void> => {
    try {
      await rest.put(Routes.applicationGuildCommands(client, guild), {
        body: commands.map((command) => command.data.toJSON()),
      });

      console.log("Successfully registered application commands.");
    } catch (error) {
      console.error(error);
    }
  })();
} else {
  console.log("One or more needed values are not set in your .env file!");
}

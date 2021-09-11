import dotenv from "dotenv";
import { Client, Intents, Interaction } from "discord.js";
import { onInteractionCreate } from "./events/onInteractionCreate.js";

dotenv.config();
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once("ready", () => {
  console.log("ready");
});

client.on(
  "interactionCreate",
  async (interaction: Interaction) => await onInteractionCreate(interaction)
);

client.login(process.env.TOKEN);

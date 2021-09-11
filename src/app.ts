import dotenv from "dotenv";
import { Client, Intents, Interaction } from "discord.js";
import { onInteractionCreate } from "./helper/onInteractionCreate.js";

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

dotenv.config();

client.once("ready", () => {
  console.log("ready");
});

client.on(
  "interactionCreate",
  async (interaction: Interaction) => await onInteractionCreate(interaction)
);

client.login(process.env.TOKEN);

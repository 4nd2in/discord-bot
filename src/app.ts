import dotenv from "dotenv";
import { Client, Intents } from "discord.js";
import { handleOnMessage } from "./helper/handleOnMessage";

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

dotenv.config();

client.once("ready", () => {
  console.log("ready");
});

client.on("message", (message) => handleOnMessage(message));

client.login(process.env.TOKEN);

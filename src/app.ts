import dotenv from "dotenv";
import Discord from "discord.js";
import { handleOnMessage } from "./helper/handleOnMessage";

const client = new Discord.Client();

dotenv.config();

client.once("ready", () => {
  console.log("ready");
});

client.on("message", (message) => handleOnMessage(message));

client.login(process.env.TOKEN);

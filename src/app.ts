import dotenv from "dotenv";
import Discord from "discord.js";

const client = new Discord.Client();
dotenv.config();

client.once("ready", () => {
  console.log("ready");
});

client.login(process.env.TOKEN);

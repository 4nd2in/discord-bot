import dotenv from "dotenv";
import fs from "fs";
import { Client, Intents } from "discord.js";
import { defineReactionRole } from "./database/DatabaseManager";

dotenv.config();
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

defineReactionRole();

const eventFiles = fs.readdirSync("./dist/events");

eventFiles.forEach((file) => {
  import(`./events/${file}`).then((object) => {
    const event = object.default;
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
  });
});

client.login(process.env.TOKEN);

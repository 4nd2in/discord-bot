import fs from "fs";
import { Collection } from "discord.js";
import { Command } from "./Command.js";

const collection = new Collection<string, Command>();
const commandFiles = fs.readdirSync("./dist/commands");

commandFiles.forEach((file) => {
  import(`../commands/${file}`).then((object) =>
    collection.set(object.default.data.name, object.default)
  );
});

export const commands: Collection<string, Command> = collection;

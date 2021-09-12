import { Client } from "discord.js";
import { sequelizeClient } from "../database/SequelizeClient";

const synchronizeDatabse = async (): Promise<void> => {
  const model = await sequelizeClient.sync();
  console.log("Model synchronization", model ? "was successful" : "failed");
};

export default {
  name: "ready",
  once: true,
  execute(client: Client): void {
    synchronizeDatabse();
    console.log(`Ready! Logged in as ${client.user?.tag}`);
  },
};

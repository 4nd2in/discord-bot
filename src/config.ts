import dotenv from "dotenv";

dotenv.config();

if (!process.env.TOKEN) {
    console.warn("Missing Discord bot token");
}

const config = {
    token: process.env.TOKEN as string
};

export default config;
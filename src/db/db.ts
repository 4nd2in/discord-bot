import { Config, JsonDB } from "node-json-db";

const dbName = "botdb";
const saveOnPush = true;
const humanReadable = false;
const separator = "/";
const syncOnSave = true;

export const db = new JsonDB(new Config(
    dbName,
    saveOnPush,
    humanReadable,
    separator,
    syncOnSave
));

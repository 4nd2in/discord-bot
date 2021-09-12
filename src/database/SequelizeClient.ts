import { Sequelize } from "sequelize";

const database = process.env.DB || "database";
const user = process.env.DB_USER || "user";
const password = process.env.DB_PW || "";

const sequelize = new Sequelize(database, user, password, {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  storage: "database.sqlite",
});

export const sequelizeClient = sequelize;

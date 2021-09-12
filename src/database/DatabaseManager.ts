import { DataTypes } from "sequelize";
import { sequelizeClient } from "./SequelizeClient";

export const defineReactionRole = (): void => {
  sequelizeClient.define("ReactionRole", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    channel: DataTypes.STRING,
    message: DataTypes.STRING,
    reaction: DataTypes.STRING,
    role: DataTypes.STRING,
  });
};

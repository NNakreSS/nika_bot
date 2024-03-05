import { Interaction, SlashCommandBuilder } from "discord.js";
import BotDescriptions from "./IDescription";

export default interface CommandType extends BotDescriptions {
  data: SlashCommandBuilder;
  permissionLevel: number;
  run(interaction: Interaction): void;
}

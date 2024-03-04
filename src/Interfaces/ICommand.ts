import { Interaction, SlashCommandBuilder } from "discord.js";
import { BotDescriptions } from "./IDescription";

export interface CommandType extends BotDescriptions {
  data: SlashCommandBuilder;
  run(interaction: Interaction): void;
}

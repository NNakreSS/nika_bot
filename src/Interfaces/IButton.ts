import { ButtonInteraction } from "discord.js";
import BotDescriptions from "./IDescription";

export default interface ButtonType extends BotDescriptions {
  execute(interaction: ButtonInteraction): void;
}

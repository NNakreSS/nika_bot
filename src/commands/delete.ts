import {
  SlashCommandBuilder,
  CommandInteraction,
  TextChannel,
} from "discord.js";
import BotDescriptions from "../Interfaces/IDescription";
import setParentChannel from "../helpers/setParentChannel";

const closeCommand: BotDescriptions = {
  name: "delete",
  description: "Mevcut ticket kanalını siler!",
};

module.exports = {
  permissionLevel: 2,
  ...closeCommand,
  data: new SlashCommandBuilder()
    .setName(closeCommand.name)
    .setDescription(closeCommand.description),

  async run(interaction: CommandInteraction) {
    const channel = interaction.channel! as TextChannel;
    if (!channel) return;
    try {
      if (channel.name.startsWith("ticket")) {
        channel.delete();
      } else {
        interaction.reply({
          content: "Bu kanal bir ticket kanalı değil!",
          ephemeral: true,
        });
      }
    } catch (e) {
      console.error(e);
    }
  },
};

import {
  SlashCommandBuilder,
  CommandInteraction,
  TextChannel,
} from "discord.js";
import BotDescriptions from "../Interfaces/IDescription";
import setParentChannel from "../helpers/setParentChannel";

const closeCommand: BotDescriptions = {
  name: "close",
  description: "Mevcut ticket kanalını kapatır!",
};

module.exports = {
  permissionLevel: 2,
  ...closeCommand,
  data: new SlashCommandBuilder()
    .setName(closeCommand.name)
    .setDescription(closeCommand.description),

  async run(interaction: CommandInteraction) {
    const guild = interaction.guild!;
    const channel = interaction.channel! as TextChannel;
    if (!channel) return;
    try {
      if (channel.name.startsWith("ticket")) {
        setParentChannel({ guild, channel, categoryName: "CLOSED-TICKETS" });
        interaction.reply({ content: "Ticket is closed!", ephemeral: true });
      } else {
        interaction.reply({
          content: "This is not a ticket channel!",
          ephemeral: true,
        });
      }
    } catch (e) {
      console.error(e);
    }
  },
};

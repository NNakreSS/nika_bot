import {
  SlashCommandBuilder,
  CommandInteraction,
  GuildChannel,
  Guild,
} from "discord.js";
import BotDescriptions from "../Interfaces/IDescription";
import setParentChannel from "../helpers/setParentChannel";

const offlineCommand: BotDescriptions = {
  name: "offline",
  description: "set offline this ticket!",
};

module.exports = {
  permissionLevel: 2,
  ...offlineCommand,
  data: new SlashCommandBuilder()
    .setName(offlineCommand.name)
    .setDescription(offlineCommand.description),

  async run(interaction: CommandInteraction) {
    const guild: Guild = interaction.guild!;
    await setParentChannel({
      guild: guild,
      categoryName: "OFFLINE_TICKETS",
      channel: interaction.channel as GuildChannel,
    });
    interaction.reply({ content: "Ticket is offline!", ephemeral: true });
  },
};

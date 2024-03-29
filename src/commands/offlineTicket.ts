import {
  SlashCommandBuilder,
  CommandInteraction,
  GuildChannel,
  Guild,
  TextChannel,
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
    // kanalı al ve text kanalı olarak belirt
    const channel = interaction.channel as TextChannel;
    // kanal adını al
    const chanelName = channel.name as String;

    // kanalın bir ticket kanalı olup olmadığını kontrol et
    if (chanelName.endsWith("-ticket") || channel.name.startsWith("ticket")) {
      await setParentChannel({
        guild: guild,
        categoryName: "OFFLINE_TICKETS",
        channel: interaction.channel as GuildChannel,
      });
      interaction.reply({ content: "Ticket is offline!", ephemeral: true });
    } else {
      interaction.reply({
        content: "This is not a ticket channel!",
        ephemeral: true,
      });
    }
  },
};

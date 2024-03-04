import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { BotDescriptions } from "../Interfaces/IDescription";

const pingCommand: BotDescriptions = {
  name: "ping",
  description: "Botun gecikme süresini kontrol eder!",
};

module.exports = {
  ...pingCommand,
  data: new SlashCommandBuilder()
    .setName(pingCommand.name)
    .setDescription(pingCommand.description),

  async run(interaction: CommandInteraction) {
    const sent = await interaction.reply({
      content: "Pong!",
      fetchReply: true,
    });

    sent.edit({
      content: `Pong! Gecikme süresi: ${
        sent.createdTimestamp - interaction.createdTimestamp
      }ms`,
    });

    setTimeout(async () => {
      await sent.delete();
    }, 5000);
  },
};

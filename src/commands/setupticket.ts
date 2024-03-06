import {
  SlashCommandBuilder,
  CommandInteraction,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ComponentType,
  Interaction,
} from "discord.js";
import BotDescriptions from "../Interfaces/IDescription";

const setupticketTool: BotDescriptions = {
  name: "setupticket",
  description: "Ticket başlangıç kanalını oluştur!",
};

module.exports = {
  permissionLevel: 2,
  ...setupticketTool,
  data: new SlashCommandBuilder()
    .setName(setupticketTool.name)
    .setDescription(setupticketTool.description),

  async run(interaction: CommandInteraction) {
    // ticket embed oluştur
    const setupEmbed = new EmbedBuilder()
      .setColor("DarkGold")
      .setTitle("Create a new Ticket")
      .setDescription("To create a ticket react with 📩")
      .setFooter({
        text: "NakreS Development",
        iconURL: interaction.guild?.iconURL() as string,
      });

    // tücket oluşturma butonu
    const createTicketButton: ButtonBuilder = new ButtonBuilder()
      .setCustomId("create-ticket")
      .setLabel("Create ticket")
      .setStyle(ButtonStyle.Secondary);

    // butonu satır içerisine ekle
    const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      createTicketButton
    );

    // ticket oluşturucu mesajını gönder
    const ticketSetup = await interaction.channel!.send({
      embeds: [setupEmbed],
      components: [buttonRow],
    });

    interaction.reply({
      content: "Ticket botu kurulum sağladı 🎉",
      ephemeral: true,
    });

    // buton eventlarını dinlemek için mesaj üzerinden collector oluştur
    const collector = ticketSetup.createMessageComponentCollector({
      componentType: ComponentType.Button,
    });

    // buton olaylarını dinle
    collector.on("collect", (interaction) => {
      if (interaction.customId === "create-ticket") {
        interaction.reply("Click create Button");
      }
    });
  },
};

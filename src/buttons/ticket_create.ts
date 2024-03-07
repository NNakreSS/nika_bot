import {
  ButtonInteraction,
  EmbedBuilder,
  PermissionsBitField,
} from "discord.js";
import createTextChanel from "../helpers/createTextChanel";

module.exports = {
  name: "ticket-create",
  description: "Tıklandığında yeni bir ticket kanalı oluşturur",
  async execute(interaction: ButtonInteraction) {
    // Sunucu guild
    const guild = interaction.guild!;
    // ticket kanalını oluştur
    const ticketChanel = await createTextChanel({
      interaction: interaction as ButtonInteraction,
      channelName: `ticket-${interaction.user.username}`,
      categoryName: "TICKETS",
      permissionOverwrites: [
        {
          id: guild.roles.everyone,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: interaction.user.id,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
          ],
        },
      ],
    });

    // kanalın oluşturulup oluşturulamadığını kontrol et
    if (ticketChanel) {
      // ticket kanalına gönderilecek giriş mesajı embed
      const openTicketEmbedMessage = new EmbedBuilder()
        .setColor("Aqua")
        .setTitle(`Welcome`)
        .setDescription(
          `Hi <@${interaction.user.id}> ,  Support will be with you shortly . ! Please explain your problem in detail first`
        )
        .setThumbnail(guild.iconURL())
        .setFooter({ text: "Made By NakreS", iconURL: guild.iconURL() ?? "" });
      // mesajı gönder
      ticketChanel.send({ embeds: [openTicketEmbedMessage] });
      // ticket tool kanalında oluşturulan ticket kanalını belirt
      interaction.reply({
        content: `Create new ticket! ${ticketChanel.toString()}`,
        ephemeral: true,
      });
    } else {
      interaction.reply({
        content: "something went wrong!",
        ephemeral: true,
      });
    }
  },
};

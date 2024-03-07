import { ButtonInteraction } from "discord.js";
import createTextChanel from "../helpers/createTextChanel";

module.exports = {
  name: "ticket-create",
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
          id: guild!.roles.everyone,
          deny: ["ViewChannel"],
        },
        {
          id: interaction.user.id,
          allow: ["ViewChannel", "SendMessages"],
        },
      ],
    });

    // kanalın oluşturulup oluşturulamadığını kontrol et
    if (ticketChanel) {
      interaction.reply({
        content: `Ticket başarıyla oluşturuldu! ${ticketChanel.toString()}`,
        ephemeral: true,
      });
    } else {
      interaction.reply({
        content: "Ticket oluşturulamadı!",
        ephemeral: true,
      });
    }
  },
};

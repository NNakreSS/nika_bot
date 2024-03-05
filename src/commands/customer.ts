import {
  SlashCommandBuilder,
  CommandInteraction,
  GuildMember,
  EmbedBuilder,
  TextChannel,
  Interaction,
} from "discord.js";
import BotDescriptions from "../Interfaces/IDescription";
import axios from "axios";
import "dotenv/config";
import ConfigTypes from "../Interfaces/IConfig";
import addRole from "../helpers/addRole";
import createTextChanel from "../helpers/createTextChanel";
const config: ConfigTypes = require(`${process.cwd()}/data/config.json`);

const pingCommand: BotDescriptions = {
  name: "customer",
  description: "Take a customer role with Transaction ID",
};

module.exports = {
  permissionLevel: 0,
  ...pingCommand,
  data: new SlashCommandBuilder()
    .setName(pingCommand.name)
    .setDescription(pingCommand.description)
    .addStringOption((option) =>
      option
        .setName("id")
        .setDescription("Your Transaction ID")
        .setRequired(true)
    ),

  async run(interaction: CommandInteraction) {
    // sunucu
    const guild = interaction.guild;
    // kullanıcı
    const member = interaction.member as GuildMember;
    try {
      // girilen satın alım idsini al
      const transactionId = interaction.options.get("id")!.value;

      // satın alım idsi ile tebex payments apisine istek at
      const response = await axios
        .get(`https://plugin.tebex.io/payments/${transactionId}`, {
          headers: { "X-Tebex-Secret": process.env.TEBEX_SECRET },
        })
        .catch(() => {
          interaction.reply({
            content: "No purchase found with that  Transaction ID!",
            ephemeral: true,
          });
        });

      // tebex payments apisine istek atılamadı
      if (!response) return;
      const data = await response.data;

      // satın alım işlemi tamamlanmadı ise
      if (data.status !== "Complete") {
        return interaction.reply({
          content: `Purchase is currently marked as ${data.status}`,
          ephemeral: true,
        });
      }

      // ücretsiz bir betik satın alımı yapıldıysa
      if (data.amount <= 0) {
        return interaction.reply({
          content: `You cannot take a customer role for free scripts`,
          ephemeral: true,
        });
      }

      // rol ver
      addRole(member, config.roleIds.customerRoleId as string);

      // satın alınan ürünler
      const packages: string[] = data.packages.map(
        (packet: { name: string }) => packet.name
      );

      // ticket kanal adı
      const ticketChanelName = ("ticket_" + member.user.username) as String;
      // customer ticket kanalını oluştur
      const ticketChanel = await createTextChanel({
        interaction: interaction as Interaction,
        channelName: ticketChanelName,
        categoryName: "CUSTOMER_TICKETS",
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

      // customer ticket kanalına başlangıç mesajını at
      const chanelEmbed = new EmbedBuilder()
        .setColor(0x00ff00)
        .setAuthor({ name: "Your support room is ready" })
        .setThumbnail(guild!.iconURL())
        .addFields(
          {
            name: "Hi",
            value: `<@${interaction.user.id}>`,
            inline: true,
          },
          {
            name: "Open Ticket",
            value: "You can request support through this channel",
            inline: true,
          }
        )
        .setFooter({ text: "Made by NakreS", iconURL: guild?.iconURL() ?? "" });

      // ticket mesajını gönder
      ticketChanel!.send({ embeds: [chanelEmbed] });

      // Satın alım detaylarını gösteren embed
      const embed = new EmbedBuilder()
        .setColor("Blue")
        .setAuthor({ name: "Purchasing information" })
        .setThumbnail(guild!.iconURL())
        .addFields(
          {
            name: "Your ticket channel",
            value: `${ticketChanel!.toString()}`,
          },
          {
            name: "User",
            value: `<@${interaction.user.id}>`,
          },
          {
            name: "Customer Name",
            value: data.player.name,
          },
          {
            name: "Email",
            value: data.email,
          },
          {
            name: "Purchased",
            value: packages.join(", "),
          },
          {
            name: "Price Payed",
            value: `${data.amount} ${data.currency.iso_4217}`,
          },
          {
            name: "Transaction ID",
            value: transactionId as string,
          },
          {
            name: "Date Purchased",
            value: data.date.slice(0, 10),
          }
        )
        .setFooter({
          text: `Made By NakreS`,
          iconURL: guild!.iconURL() ?? "",
        });

      // customer komutunu yanıtla
      interaction.reply({ embeds: [embed], ephemeral: true });

      // customer role bildiriminin atılacağı kanal
      const customerRoleLogChanel: TextChannel | undefined =
        guild!.channels.cache.get(
          config.chanelIds.customerRoleLogChanelId as string
        ) as TextChannel;

      // log kanalına bildirimi gönder
      customerRoleLogChanel.send({ embeds: [embed] });
    } catch (error) {
      console.error(error);
    }
  },
};

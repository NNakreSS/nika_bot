import {
  SlashCommandBuilder,
  CommandInteraction,
  GuildMember,
  EmbedBuilder,
  TextChannel,
} from "discord.js";
import BotDescriptions from "../Interfaces/IDescription";
import axios from "axios";
import "dotenv/config";
import ConfigTypes from "../Interfaces/IConfig";
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
    const guild = interaction.guild;
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

      // kullanıcı
      const member = interaction.member as GuildMember;
      // kullanıcıya verilecek rol
      const customerRole: any = guild!.roles.cache.get(
        config.roleIds.customerRoleId as string
      );
      // customer role kullanıcıya ekleniyor
      await member.roles.add(customerRole);

      // satın alınan ürünler
      const packages: string[] = data.packages.map(
        (packet: { name: string }) => packet.name
      );

      // Satın alım detaylarını gösteren embed
      const embed = new EmbedBuilder()
        .setColor("Blue")
        .setAuthor({ name: "Purchasing information" })
        .setThumbnail(guild!.iconURL())
        .addFields(
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
            name: "Date Purchased",
            value: data.date.slice(0, 10),
          }
        )
        .setFooter({
          text: `Made By NakreS`,
          iconURL: guild!.iconURL() ?? "",
        });
      // .addField(`Your ticket channel`, `${channel.toString()}`)
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

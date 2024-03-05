import { EmbedBuilder, Guild, GuildMember, TextChannel } from "discord.js";
import ConfigTypes from "../Interfaces/IConfig";
const config: ConfigTypes = require(`${process.cwd()}/data/config.json`);

module.exports = {
  name: "guildMemberRemove",
  async execute(member: GuildMember) {
    try {
      // ayrıldığı sunucu
      const guild: Guild = member.guild;

      // Kullanıcının ayrıldığı mesajının gösterileceği kanalı alma
      const channel: TextChannel | undefined = guild.channels.cache.get(
        config.leaveNotificationChanelId as string
      ) as TextChannel;

      // Kanal bulunamadıysa hata mesajı gönderme
      if (!channel) {
        console.error(`Kanal bulunamadı: ${config.leaveNotificationChanelId}`);
        return;
      }

      // sunucudaki toplam üye sayısı
      const totalMemberCount: number = guild.memberCount;
      // Kullanıcı ayrıldı mesajı gönderme
      const embed = new EmbedBuilder()
        .setAuthor({
          name: member.nickname ?? member.displayName,
          iconURL: member.user.defaultAvatarURL,
          url: member.user.defaultAvatarURL,
        })
        .setColor("Red")
        .setTitle(`Sunucudan ayrıldı!`)
        .setDescription(`Toplam Üye Sayısı: ${totalMemberCount}`)
        .setTimestamp();
      await channel.send({ content: member.toString(), embeds: [embed] });
    } catch (error) {
      console.error("guildMemberAdd Error: " + error);
    }
  },
};

import { Guild, GuildMember, TextChannel, EmbedBuilder } from "discord.js";
import ConfigTypes from "../Interfaces/IConfig";
const config: ConfigTypes = require(`${process.cwd()}/data/config.json`);

module.exports = {
  name: "guildMemberAdd",
  async execute(member: GuildMember) {
    try {
      // katınılan sunucu
      const guild: Guild = member.guild;

      // kullanıcıya verilecek rol
      const role: any = guild.roles.cache.get(config.customerRoleId as string);
      // rolü kullanıcıya ver
      await member.roles.add(role);

      // Kullanıcının katıldığı mesajın gösterileceği kanalı alma
      const channel: TextChannel | undefined = guild.channels.cache.get(
        config.joinNotificationChanelId as string
      ) as TextChannel;

      // Kanal bulunamadıysa hata mesajı gönderme
      if (!channel) {
        console.error(`Kanal bulunamadı: ${config.joinNotificationChanelId}`);
        return;
      }

      // sunucudaki toplam üye sayısı
      const totalMemberCount: number = guild.memberCount;

      // Kullanıcı katıldı mesajı gönderme
      const embed = new EmbedBuilder()
        .setAuthor({
          name: member.nickname ?? member.displayName,
          iconURL: member.user.defaultAvatarURL,
          url: member.user.defaultAvatarURL,
        })
        .setColor("#00ff00")
        .setTitle(`Sunucuya Katıldı!`)
        .addFields(
          {
            name: "Hesap oluşturulma tarihi",
            value: member.user.createdAt.toLocaleDateString(),
          },
          {
            name: "Toplam üye",
            value: `Toplam Üye Sayısı: ${totalMemberCount}`,
          }
        )
        .setTimestamp();

      await channel.send({ content: member.toString(), embeds: [embed] });
    } catch (error) {
      console.error("guildMemberAdd | " + error);
    }
  },
};

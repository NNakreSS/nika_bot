import {
  ButtonInteraction,
  CategoryChannelResolvable,
  ChannelType,
  Collection,
  Interaction,
  OverwriteResolvable,
  TextChannel,
} from "discord.js";

type createTextChanelParams = {
  interaction: Interaction | ButtonInteraction;
  channelName: String;
  categoryName?: String;
  permissionOverwrites?:
    | OverwriteResolvable[]
    | Collection<string, OverwriteResolvable>
    | undefined;
};

export default async ({
  interaction,
  channelName,
  categoryName,
  permissionOverwrites,
}: createTextChanelParams): Promise<TextChannel | undefined> => {
  const guild = interaction.guild!;
  try {
    // kullanıcı adındaki noktayı kısa çizgiye çevir (kanal isimlerinde noktaya izin verilmez)
    channelName = channelName.replace(/[.]/g, "_");

    // bu isimde bir kanal var mı
    const existingChannel = guild.channels.cache.find((channel) => {
      return channel?.name.toLowerCase() === channelName.toLowerCase();
    });

    // aynı isimde kanal yoksa
    if (!existingChannel) {
      // kategori çek
      let category: CategoryChannelResolvable | null =
        guild.channels.cache.find(
          (cat) =>
            cat.name.toLowerCase() === categoryName?.toLowerCase() &&
            cat.type === ChannelType.GuildCategory
        ) as CategoryChannelResolvable;

      // kategori name iletilmiş ama istenen kategori yoksa
      if (categoryName && !category) {
        // kategoriyi oluştur ve ata
        category = await guild.channels.create({
          name: categoryName as string,
          type: ChannelType.GuildCategory,
        });
      }

      const newChannel = await guild.channels.create({
        name: channelName as string,
        type: ChannelType.GuildText,
        parent: category ?? null,
        permissionOverwrites: permissionOverwrites,
      });

      return newChannel as TextChannel;
    } else {
      return existingChannel as TextChannel;
    }
  } catch (error) {
    console.error(error);
  }
};

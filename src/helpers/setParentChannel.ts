import {
  CategoryChannelResolvable,
  ChannelType,
  Guild,
  GuildChannel,
} from "discord.js";

type setParentChannelParams = {
  guild: Guild;
  channel: GuildChannel;
  categoryName: String;
};

export default async ({
  guild,
  channel,
  categoryName,
}: setParentChannelParams): Promise<void> => {
  try {
    let category: CategoryChannelResolvable | null = guild.channels.cache.find(
      (cat) =>
        cat.name.toLowerCase() === categoryName?.toLowerCase() &&
        cat.type === ChannelType.GuildCategory
    ) as CategoryChannelResolvable;

    //  istenen kategori yoksa
    if (!category) {
      // kategoriyi oluştur ve ata
      category = await guild.channels.create({
        name: categoryName as string,
        type: ChannelType.GuildCategory,
      });
    }

    // parent kategori altına taşı
    await channel.setParent(category, { lockPermissions: false });
  } catch (error) {
    console.error(error);
  }
};

import { GuildMember } from "discord.js";

export default async (member: GuildMember, roleId: string) => {
  // kullanıcıya verilecek rol
  const role: any = member.guild.roles.cache.get(roleId);
  // rolü kullanıcıya ver
  await member.roles.add(role);
};

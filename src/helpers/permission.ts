import { Collection, GuildMember, Role } from "discord.js";
import CommandType from "../Interfaces/ICommand";
import ConfigTypes from "../Interfaces/IConfig";
const config: ConfigTypes = require(`${process.cwd()}/data/config.json`);

export default (member: GuildMember, command: CommandType): boolean => {
  // Kullanıcının rollerini alma
  const roles: Collection<string, Role> = member.roles.cache;

  // Komutun yetki seviyesini alma
  const requiredPermissionLevel: number = command.permissionLevel;

  // Kullanıcının en yüksek yetki seviyesini bulma
  let highestPermissionLevel: number = 0;
  roles.forEach((role: Role) => {
    const rolePermissionLevel: number = config.rolePermissions[role.id];
    if (rolePermissionLevel > highestPermissionLevel) {
      highestPermissionLevel = rolePermissionLevel;
    }
  });

  // Kullanıcının gerekli yetkiye sahip olup olmadığını kontrol etme
  return highestPermissionLevel >= requiredPermissionLevel;
};

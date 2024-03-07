import { GuildMember, Interaction } from "discord.js";
import { commands } from "..";
import permission from "../helpers/permission";

module.exports = {
  name: "interactionCreate",
  async execute(interaction: Interaction) {
    // etkileşimin ChatInputCommandInteraction olup olmadığını kontrol et
    if (interaction.isChatInputCommand()) {
      try {
        let command = commands.get(interaction.commandName);
        if (!command) return;
        const commandAuthor = interaction.member as GuildMember;
        const memberHasPermission = permission(commandAuthor, command);
        if (memberHasPermission) {
          command.run(interaction);
        } else {
          interaction.reply({
            content: "Bu komut için gerekli yetkiye sahip değilsin!",
            ephemeral: true,
          });
        }
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: "Bir hata oluştu!",
          ephemeral: true,
        });
      }
      // etkileşimin buton olup olmadığnı kontrol et
    } else if (interaction.isButton()) {
      
    }
  },
};

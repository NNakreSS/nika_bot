import { Collection, GuildMember, Interaction } from "discord.js";
import { commands } from "..";
import permission from "../helpers/permission";
import { readdirSync } from "fs";
import ButtonType from "../Interfaces/IButton";
import { resolve } from "path";

const buttons = new Collection<String, ButtonType>();
// buttons klasörü
const buttonsFile = resolve(`${__filename}/../../buttons`);
// buton dosyalarından komutların isimleri
const buttonFiles = readdirSync(resolve(buttonsFile)).filter(
  (file) => file.endsWith(".js") || file.endsWith(".ts")
);
// buttonları buttons collectiona ekle
buttonFiles.forEach((b) => {
  const button = require(`${buttonsFile}/${b}`);
  buttons.set(button.name, button);
});

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
      const button = buttons.get(interaction.customId);
      if (!button) return;
      button.execute(interaction);
    }
  },
};

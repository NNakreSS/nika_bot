import { Interaction } from "discord.js";
import { commands } from "..";

module.exports = {
  name: "interactionCreate",
  async execute(interaction: Interaction) {
    // etkileşimin ChatInputCommandInteraction olup olmadığını kontrol et
    if (!interaction.isChatInputCommand()) return;
    try {
      let command = commands.get(interaction.commandName);
      if (!command) return;
      command.run(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: "Bir hata oluştu!", ephemeral: true });
    }
  },
};

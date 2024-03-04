import "dotenv/config";
import {
  REST,
  Routes,
  Client,
  GatewayIntentBits,
  Collection,
  ApplicationCommand,
} from "discord.js";
import { readdirSync } from "fs";
import { CommandType } from "./Interfaces/ICommand";

const commandsFileRoot = `${process.cwd()}/src/commands`;

// komutları içerecek olan array
const commands = new Collection<string, CommandType>();

// komut dosyalarından komutların isimleri
const commandFiles = readdirSync(commandsFileRoot).filter(
  (file) => file.endsWith(".js") || file.endsWith(".ts")
);

// bot clienti oluştur
const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

// bot token ile bağlan
bot.login(process.env.TOKEN);

// botun hazır olma durumunu dinle
bot.on("ready", (c) => {
  console.log(`Logged in as ${c.user.username}!`);
  registerSlashCommands();
});

// rest api ile slash komutlarının kayıt işlemi
async function registerSlashCommands() {
  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN!);
  try {
    console.log("Get application (/) commands.");
    const slashCommands: ApplicationCommand[] = [];
    // tüm komut dosyaları için require ile dosyayı import edip slash komutlarını kaydet
    commandFiles.forEach((c) => {
      const command = require(`${commandsFileRoot}/${c}`);
      commands.set(command.name, command);
      slashCommands.push(command.data);
    });

    console.log("Started refreshing application (/) commands.");

    // listeye eklenen tüm slash komutlarını bota ekle
    await rest.put(Routes.applicationCommands(bot.application!.id), {
      body: slashCommands,
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (err) {
    console.error(err);
  }
}

bot.on("interactionCreate", async (interaction) => {
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
});

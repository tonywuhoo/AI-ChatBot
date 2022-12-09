import { Client, Routes, REST, GatewayIntentBits, Events, EmbedBuilder, WebhookClient, roleMention } from "discord.js"
import {searchImage} from "./OpenAIServices.js"
import dotenv from 'dotenv'
import { title } from "process";
import { resolve } from "path";
dotenv.config()

const TOKEN = process.env.DISCORD_BOT_TOKEN
const CLIENT_ID = process.env.APPLICATION_ID
const GUILD_ID = process.env.GUILD_ID
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
})


client.login(TOKEN);

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}, a private bot created by Tony Wu`);
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isCommand()) {
    return
  }

  const { commandName, options } = interaction
  
  if (commandName === "genimage") {
    await interaction.deferReply({
      ephemeral: false,
    })
    let response = await searchImage(interaction.options.get('genimage')["value"])
    interaction.followUp('Generating Image with prompt: ' + interaction.options.get('genimage')["value"]);
    await new Promise(resolve => setTimeout(resolve, 2000))
      interaction.editReply({
        content: response,
      })
  }
});

const rest = new REST({ version: '10' }).setToken(TOKEN);


async function main() {
  const commands = [
    {
      name: "genimage",
      description: "Uses OpenAI image generator to generate an image",
      options: [{
        name: "genimage",
        description: "Please Enter a prompt for the AI to process",
        type: 3,
        require: true,
        },
      ],
    }
  ]
  try {
    console.log('Started refreshing application (/) commands.');
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: commands,
    });
    console.log('Successfully reloaded application (/) commands.');
  } catch (err) {
    console.log(err)
  }
}

main()

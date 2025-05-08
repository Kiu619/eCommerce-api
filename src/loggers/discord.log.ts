import { Client, GatewayIntentBits } from 'discord.js'

const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.MessageContent]
})

client.login(process.env.DISCORD_TOKEN)

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}`)
})

client.on('messageCreate', (message) => {
  if (message.author.bot) return
  if (message.content === 'hello') {
    message.reply('Hello! How can I help you today?')
  }
})



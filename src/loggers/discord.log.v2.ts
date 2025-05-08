// import { Client, GatewayIntentBits, TextChannel } from 'discord.js'

// class LoggerService {
//   // private client
//   // private channelId
//   private client: Client
//   private channelId: string | undefined

//   constructor() {
//     this.client = new Client({
//       intents: [
//         GatewayIntentBits.DirectMessages,
//         GatewayIntentBits.Guilds, 
//         GatewayIntentBits.GuildMessages, 
//         GatewayIntentBits.MessageContent
//       ]
//     })

//     // add channel Id
//     this.channelId = process.env.DISCORD_CHANNEL_ID

//     this.client.on('ready', () => {
//       console.log(`Logged in as ${this.client.user?.tag}`)
//     })

//     this.client.login(process.env.DISCORD_TOKEN)
//   }

//   // sendFormatCode(logData: string) {
//   //   const { code: string, message = 'This is some additional information about the code', title = 'Code Example' } = logData
//   // }

//   sendMessage(message = 'message') {
//     const channel = this.client.channels.cache.get(this.channelId as string)
//     if (!channel) {
//       console.log('Channel not found')
//       return
//     }

//     // channel.send(message).catch(console.error)
//     (channel as TextChannel).send(message).catch(console.error);

//   }
// }

// export default new LoggerService()

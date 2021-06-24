import TelegramBot from "node-telegram-bot-api"
import { sendAGif } from "."

export default (bot: TelegramBot, chatId: number, type: string, message: string) => {
    const responseType = (type === 'failure') ? 'USER ERROR' : 'USER ACTION'
    console.info(`${responseType}:`, message)
    bot.sendDocument(chatId, sendAGif(type))
         .then(() => bot.sendMessage(chatId, message)) 
}


import { sendAGif } from "."

export default (bot, chatId, type, message) => {
    const responseType = (type === 'failure') ? 'USER ERROR' : 'USER ACTION'
    console.info(`${responseType}:`, message)
    bot.sendDocument(chatId, sendAGif(type))
         .then(() => bot.sendMessage(chatId, message)) 
}


require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');

const botToken = process.env.TELEGRAM_BOT_TOKEN

const bot = new TelegramBot(botToken, {polling: true});

bot.onText(/\/start/, (msg) => {
  
    const chatId = msg.chat.id;
  
    bot.sendMessage(chatId, 'Hey, Welcome to the receiptbot');
});

const renameFile = (oldName, newName) => {
    const matcher = /downloads\/(file_\d).\w+/
    const match = oldName.match(matcher)[1]
    return newName 
        ? oldName.replace(match, newName)
        : oldName
}

bot.on('photo', (msg) => {
    const chatId = msg.chat.id;
    const lastPhoto = msg.photo.slice(-1)[0]
    bot.downloadFile(lastPhoto.file_id, './downloads')
    .then((path) => {
        const newName = msg.caption || null
        const renamedFile = renameFile(path, newName)
        fs.rename(
            path,
            renamedFile,
            () => {
                bot.sendMessage(chatId, `File, ${renamedFile} saved`);
            }
        )
    })
});

bot.on('document', (msg) => {
    const chatId = msg.chat.id;
    bot.downloadFile(msg.document.file_id, './downloads')
    .then((path) => {
        const newName = msg.caption || msg.document.file_name
        const renamedFile = renameFile(path, newName)
        fs.rename(
            path,
            renamedFile,
            () => {
                bot.sendMessage(chatId, `File, ${renamedFile} saved`);
            }
        )
    })
});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const fileList = fs.readdirSync(`${__dirname}/gifs`)
    const gifList = fileList.filter(file => path.extname(file).toLowerCase() === '.gif')
            
    const response = gifList[Math.floor(Math.random() * gifList.length)] 

    bot.sendDocument(chatId, `${__dirname}/gifs/${response}`)
     .then(() => bot.sendMessage(chatId, "This bot only accepts files, not text")) 
});
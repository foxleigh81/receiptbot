require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

const botToken = process.env.TELEGRAM_BOT_TOKEN

const bot = new TelegramBot(botToken, {polling: true});

bot.onText(/\/start/, (msg) => {
  
    const chatId = msg.chat.id;
  
    bot.sendMessage(chatId, 'Hey, Welcome to the receiptbot');
});

bot.onText(/\/add (.+)/, (msg, match) => {
  
    const chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"
    console.log(msg)
    // send back the matched "whatever" to the chat
    bot.sendMessage(chatId, `Added ${resp} file`);
});


const renameFile = (oldName, newName) => {
    const matcher = /downloads\/(file_\d).\w+/
    const match = oldName.match(matcher)[1]
    return newName 
        ? oldName.replace(match, newName)
        : oldName
}

// bot.on('message', (msg) => {
//     const chatId = msg.chat.id;

//     if (msg.photo.length > 0) {
//         // Photo received
//         const lastPhoto = msg.photo.slice(-1)[0]
//         bot.downloadFile(lastPhoto.file_id, './downloads')
//         .then((path) => {
//             const newName = msg.caption || null
//             fs.rename(
//                 path,
//                 renameFile(path, newName),
//                 () => {
//                     console.log('file renamed')
//                 }
//             )
//         })
//     }

//     if (msg.document && msg.document.file_name !== '') {
//         // Other file received
//         console.log(msg.document)
//     }
   
//     // send a message to the chat acknowledging receipt of their message
//     bot.sendMessage(chatId, 'Received your message');
//   });

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
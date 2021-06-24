require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const schedule = require('node-schedule')
const { getQuarter, getYear } = require('date-fns')

const botToken = process.env.TELEGRAM_BOT_TOKEN

const bot = new TelegramBot(botToken, {polling: true});
const today = new Date()
const downloadPath = `${__dirname}/downloads/${getYear(today)}/Q${getQuarter(today)}`

const renameFile = (oldName, newName) => {
    const matcher = /\/downloads\/\d{4}\/Q\d\/(file_\d+).\w+/
    const match = oldName.match(matcher)[1]
    return newName 
        ? oldName.replace(match, newName)
        : oldName
}

// Check if the full download path exists and create if it doesn't
const checkCreateDirectory = (pathstring) => {
    if (!fs.existsSync(pathstring)) {
        console.log(`${pathstring} did not exist and has now been created`)
        return fs.mkdirSync(pathstring, { recursive: true })
    }
    return console.log(`${pathstring} already exists, no tasks required.`)
}

// Run below function when script starts and once per day at midnight
checkCreateDirectory(downloadPath)
schedule.scheduleJob('0 0 * * *', () => checkCreateDirectory(downloadPath))

bot.onText(/\/start/, (msg) => { 
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Hey, Welcome to the receiptbot');
});

bot.on('photo', (msg) => {
    const chatId = msg.chat.id;
    const lastPhoto = msg.photo.slice(-1)[0]
    const newName = msg.caption || null
    bot.downloadFile(lastPhoto.file_id, downloadPath)
    .then((path) => {
        // TODO check for duplicate filenames
        const renamedFile = renameFile(path, newName)
        fs.rename(
            path,
            renamedFile,
            () => {
                console.log(renamedFile, 'uploaded')
                bot.sendMessage(chatId, `File, ${newName} saved`);
            }
        )
    })
});

bot.on('document', (msg) => {
    const chatId = msg.chat.id;
    bot.downloadFile(msg.document.file_id, downloadPath)
    .then((path) => {
        const newName = msg.caption || msg.document.file_name
        const renamedFile = renameFile(path, newName)
        fs.rename(
            path,
            renamedFile,
            () => {
                console.log(renamedFile, 'uploaded')
                bot.sendMessage(chatId, `File "${newName}", saved`);
            }
        )
    })
});

// bot.on('message', (msg) => {
//     const chatId = msg.chat.id;
//     const fileList = fs.readdirSync(`${__dirname}/gifs`)
//     const gifList = fileList.filter(file => path.extname(file).toLowerCase() === '.gif')
            
//     const response = gifList[Math.floor(Math.random() * gifList.length)] 

//     bot.sendDocument(chatId, `${__dirname}/gifs/${response}`)
//      .then(() => bot.sendMessage(chatId, "This bot only accepts files, not text")) 
// });
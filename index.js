require('dotenv').config()
import TelegramBot from 'node-telegram-bot-api';
import { scheduleJob } from 'node-schedule';
import { getQuarter, getYear } from 'date-fns';

import { checkCreateDirectory, processFile } from './functions'; 

const botToken = process.env.TELEGRAM_BOT_TOKEN

const bot = new TelegramBot(botToken, {polling: true});
const today = new Date()
const downloadPath = `${__dirname}/downloads/${getYear(today)}/Q${getQuarter(today)}`

// Run below function when script starts and once per day at midnight
checkCreateDirectory(downloadPath)
scheduleJob('0 0 * * *', () => checkCreateDirectory(downloadPath))

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
        processFile(bot, chatId, path, newName)
    })
});

bot.on('document', (msg) => {
    const chatId = msg.chat.id;
    const newName = msg.caption || msg.document.file_name
    bot.downloadFile(msg.document.file_id, downloadPath)
    .then((path) => {
        processFile(bot, chatId, path, newName)
    })
});

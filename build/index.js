"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const node_schedule_1 = require("node-schedule");
const date_fns_1 = require("date-fns");
const path_1 = __importDefault(require("path"));
const functions_1 = require("./functions");
const botToken = process.env.TELEGRAM_BOT_TOKEN;
const bot = new node_telegram_bot_api_1.default(botToken, { polling: true });
const today = new Date();
const downloadPath = path_1.default.resolve(__dirname, `../downloads/${date_fns_1.getYear(today)}/Q${date_fns_1.getQuarter(today)}`);
// Run below function when script starts and once per day at midnight
functions_1.checkCreateDirectory(downloadPath);
node_schedule_1.scheduleJob('0 0 * * *', () => functions_1.checkCreateDirectory(downloadPath));
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Hey, Welcome to the receiptbot');
});
bot.on('photo', (msg) => {
    const chatId = msg.chat.id;
    const lastPhoto = msg.photo?.slice(-1)[0];
    const newName = msg.caption || null;
    lastPhoto && bot.downloadFile(lastPhoto.file_id, downloadPath)
        .then((path) => {
        functions_1.processFile(bot, chatId, path, newName);
    });
});
bot.on('document', (msg) => {
    const chatId = msg.chat.id;
    const newName = msg.caption || msg.document?.file_name;
    msg.document && bot.downloadFile(msg.document.file_id, downloadPath)
        .then((path) => {
        functions_1.processFile(bot, chatId, path, newName);
    });
});
bot.onText(/\*+/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'I don\'t get it');
});

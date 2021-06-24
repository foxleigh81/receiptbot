require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api');

const botToken = process.env.TELEGRAM_BOT_TOKEN

const bot = new TelegramBot(botToken, {polling: true});

bot.onText(/\/start/, (msg) => {
  
    const chatId = msg.chat.id;
  
    bot.sendMessage(chatId, 'Hey, Welcome to the receiptbot');
});

bot.onText(/\/add (.+)/, (msg, match) => {
  
    const chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"
  
    // send back the matched "whatever" to the chat
    bot.sendMessage(chatId, `Added ${resp} file`);
});



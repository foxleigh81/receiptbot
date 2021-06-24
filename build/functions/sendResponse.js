"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
exports.default = (bot, chatId, type, message) => {
    const responseType = (type === 'failure') ? 'USER ERROR' : 'USER ACTION';
    console.info(`${responseType}:`, message);
    bot.sendDocument(chatId, _1.sendAGif(type))
        .then(() => bot.sendMessage(chatId, message));
};

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const _1 = require(".");
exports.default = (bot, chatId, oldName, newName) => {
    const matcher = /\/downloads\/\d{4}\/Q\d\/(file_\d+).\w+/;
    const match = oldName.match(matcher);
    const capture = match && match[1];
    const renamedFile = newName
        ? oldName.replace(capture, newName)
        : oldName;
    if (fs_1.default.existsSync(renamedFile)) {
        return _1.sendResponse(bot, chatId, 'failure', `There is already a file called "${newName}", try again with a new name`);
    }
    return fs_1.default.rename(oldName, renamedFile, () => {
        _1.sendResponse(bot, chatId, 'success', `File "${newName}", saved`);
    });
};

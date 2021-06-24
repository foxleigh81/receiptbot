import fs from 'fs'
import { sendResponse } from '.'
import TelegramBot from 'node-telegram-bot-api'

export default (bot: TelegramBot, chatId: number, oldName: string, newName?: string | null) => {
    const matcher = /\/downloads\/\d{4}\/Q\d\/(file_\d+).\w+/
    const match = oldName.match(matcher)
    const capture = match! && match[1]
    const renamedFile = newName 
        ? oldName.replace(capture, newName)
        : oldName
    if (fs.existsSync(renamedFile)) {
        return sendResponse(bot, chatId, 'failure', `There is already a file called "${newName}", try again with a new name`)
    }
    return fs.rename(
        oldName,
        renamedFile,
        () => {
            sendResponse(bot, chatId, 'success', `File "${newName}", saved`)
        }
    )
}
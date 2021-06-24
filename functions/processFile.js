import fs from 'fs'
import { sendResponse } from '.'

export default (bot, chatId, oldName, newName) => {
    const matcher = /\/downloads\/\d{4}\/Q\d\/(file_\d+).\w+/
    const match = oldName.match(matcher)[1]
    const renamedFile = newName 
        ? oldName.replace(match, newName)
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
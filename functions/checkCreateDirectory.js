const fs = require('fs')

// Check if the full download path exists and create if it doesn't
export default (pathstring) => {
    if (!fs.existsSync(pathstring)) {
        console.log(`SERVER: "${pathstring}" did not exist and has now been created`)
        return fs.mkdirSync(pathstring, { recursive: true })
    }
    return console.log(`SERVER: "${pathstring}" already exists, no tasks required.`)
}
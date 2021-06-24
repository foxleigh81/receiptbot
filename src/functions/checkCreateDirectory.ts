import fs from 'fs'

// Check if the full download path exists and create if it doesn't
export default (pathstring: string) => {
    let message = `SERVER: "${pathstring}" already exists, no tasks required.`
    if (!fs.existsSync(pathstring)) {
        fs.mkdirSync(pathstring, { recursive: true })
        message = `SERVER: "${pathstring}" did not exist and has now been created`
    }
    console.log(message)
    return message
}
import path from 'path'
import fs from 'fs'

export default (type: string) => {
    const fileList = fs.readdirSync(path.resolve(__dirname, `../../gifs/${type}`))
    const gifList = fileList.filter((file: string) => path.extname(file).toLowerCase() === '.gif')
    const response = gifList[Math.floor(Math.random() * gifList.length)] 

    return (path.resolve(__dirname, `../../gifs/${type}/${response}`))
}
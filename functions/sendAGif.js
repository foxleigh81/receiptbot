const path = require('path')
const fs = require('fs')

export default (type) => {
    const fileList = fs.readdirSync(path.resolve(__dirname, `../gifs/${type}`))
    const gifList = fileList.filter(file => path.extname(file).toLowerCase() === '.gif')
    const response = gifList[Math.floor(Math.random() * gifList.length)] 

    return (path.resolve(__dirname, `../gifs/${type}/${response}`))
}
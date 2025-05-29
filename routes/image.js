
const Router = require('express').Router()
const fs = require('fs')
const path = require('path')
Router.get('/profile/:userid', async (req ,res) => {
    const userid = req.params.userid
    const dirPath = path.resolve(__dirname,'..','public', 'profile');

    const images = fs.readdirSync(dirPath)
    const result = images.find(file => file.startsWith(userid + '.'))
    const full_path = path.resolve(`public/profile/${result}`) 
    res.sendFile(full_path)
})


module.exports = Router
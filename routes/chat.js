const { send_msg_controller, get_msg_controller } = require('../controller/chat')

const Router = require('express').Router()

Router.post('/send', async (req,res) => {
    await send_msg_controller(req , res)
})

Router.get('/get/:target_id/:sender_id', async (req,res) => {
    await get_msg_controller(req , res)
})




module.exports = Router
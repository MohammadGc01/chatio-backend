const { register_controller, login_controller, finduser, addfriend, getfriends } = require('../controller/user')

const Router = require('express').Router()

Router.post('/register', async (req,res) => {
    await register_controller(req , res)
})

Router.post('/login', async (req,res) => {
    await login_controller(req , res)
})

Router.get('/search/:username', async (req,res) => {
    await finduser(req,res)
})

Router.post('/addfriend', async (req,res) => {
    await addfriend(req,res)
})

Router.get('/getfriend/:requester_id', async (req ,res) => {
    await getfriends(req,res)
})

module.exports = Router
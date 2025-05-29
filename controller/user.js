const db = require("../utills/db_connection")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const discord_log = require("../utills/calsses/Discord_log")

async function register_controller(req,res) {
      const data = {
        username : req.body.username,
        email : req.body.email,
        password : req.body.password
    }
     const sql = "INSERT INTO users(username,email,password) VALUES (?,?,?)"
     const hashpass = await bcrypt.hash(data.password,10)
     db.query(sql,[data.username,data.email,hashpass] , (err , result) => {
        if(err){
          return  res.json(err)
        }
        res.json({
            success : true,
            message : "your account registered"
        }).status(201)
          const log = new discord_log("#ff9595",
            `
             **Action :** New User Register,\n
            ** Success :**true\n
             **Informations :**
              username : ${data.username}
              email : ${data.email}
            `,
           "https://discord.com/api/webhooks/1375460446999547994/nYtjuWKcPw3xSrjfOllCGs1pTkVeeRqKmfyTxmea-TwJ_qmuvsq0l7ZptvligkZmFKT4")
           log.send()
     })
}

async function login_controller(req,res) {
      const data = {
        email : req.body.email,
        password : req.body.password
    }
    const sql = "SELECT * FROM users WHERE email = ?"
    db.query(sql, [data.email], async (err, result) => {
        if(err){
        return  res.json(err)
        }
        if(!result || result.length === 0){
          return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }
        const user = result[0];
        const matchpassword = await bcrypt.compare(data.password , user.password)
        if(!matchpassword){
         return  res.status(401).json({
                success : false,
                message : "password not match"
            })
        }

        const token = await jwt.sign({
            id : user.id,
            username : user.username,
            email : user.email
        }, "secret_adwadawdwa", {expiresIn : '1h'})
        res.status(200).json({
             success : true,
             message : "user login",
             token
        })
        const log = new discord_log("#ff9595",
            `
             **Action :** User Login Success,\n
             **Username :** ${user.username}\n
             **Success :** true

            `,
           "https://discord.com/api/webhooks/1375460446999547994/nYtjuWKcPw3xSrjfOllCGs1pTkVeeRqKmfyTxmea-TwJ_qmuvsq0l7ZptvligkZmFKT4",user.id)
           log.send()
    })
}

async function finduser(req,res) {
  const username = req.params.username
  const sql = "SELECT id, username, email FROM users WHERE username LIKE ?"
  db.query(sql , [`%${username}%`], (err,result) => {
    if(err){
    return  res.json(err)
    }
    res.json(result)
  })
}

async function addfriend(req,res) {
  const {requester_id , receiver_id  } = req.body

  if(!requester_id && !receiver_id){
  return  res.json({
      success : false,
      message : "invelid params"
    })
  }
  const sql = "INSERT INTO friends (requester_id, receiver_id) VALUES (?,?)"
  db.query(sql , [requester_id , receiver_id], (err,result) => {
        if(err){
          res.json(err)
        }

        res.json({
          message : "user added to friend"
        })
  })
}

async function getfriends(req , res) {
  const {requester_id  } = req.params
  const sql = `SELECT DISTINCT  u.id, u.username FROM friends f JOIN users u ON (
   (f.requester_id = ? AND u.id = f.receiver_id) OR
   (f.receiver_id = ? AND u.id = f.requester_id) 

  )`

  db.query(sql, [requester_id , requester_id] , (err,result) => {
    if(err){
      res.json(err)
    }
    res.json(result);
    
  })


}

module.exports = {
    register_controller,
    login_controller,
    finduser,
    addfriend,
    getfriends

}

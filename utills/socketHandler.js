const { getfriends, addfriend } = require("../controller/user")

function setupSocket(io) {
  io.on('connection', (socket) => {
 
    console.log("✅ user connect id :" + socket.id)
        
    socket.on("register_user", async (userID) => {
       socket.join(userID.toString()); 
  console.log(`User ${userID} joined room ${userID}`);
      try {
        const result = await getfriends(userID)
      socket.emit("get_friend", (result))
      } 
      catch (error) {
      socket.emit("get_friend", (error))
      }
    })

   socket.on("add_friend", async ({ requester_id, receiver_id }) => {
     try {
       await addfriend(requester_id, receiver_id)
       const requesterfriend = await getfriends(requester_id)
       const receiverfriend = await getfriends(receiver_id)

       io.to(requester_id.toString()).emit("get_friend", requesterfriend)
       io.to(receiver_id.toString()).emit("get_friend", receiverfriend)

     } 
     catch (error) {
      //  io.to(requester_id).emit("get_friend",{
      //   success : false,
      //   message : `Error : ${error}`
      //  })
      console.error("add_friend error:", error); 
    }
   });




    socket.on('disconnect', () => {
      console.log("❌ user disconnect  id :" , socket.id);
    });
  });
}

module.exports = setupSocket;

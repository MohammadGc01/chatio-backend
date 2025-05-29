const db = require("../utills/db_connection");

async function send_msg_controller(req, res) {
  const io = req.app.get('io'); // 👈 گرفتن io
  const { target_id, sender_id, message } = req.body;

  if (!target_id || !sender_id || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const sql = "INSERT INTO messages (target_id, sender_id, message) VALUES (?, ?, ?)";
  db.query(sql, [target_id, sender_id, message], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }


    const newMsg = {
      id: result.insertId,
      target_id,
      sender_id,
      message
    };
    io.emit('new_message', newMsg); 
    

    res.status(200).json({
      success: true,
      message: newMsg
    });
  });
}


async function get_msg_controller(req, res) {
    const io = req.app.get('io');

    const { target_id, sender_id } = req.params;

    const sql = `
        SELECT * FROM messages 
        WHERE (target_id = ? AND sender_id = ?) 
           OR (target_id = ? AND sender_id = ?)
    `;

    db.query(sql, [target_id, sender_id, sender_id, target_id], (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Database error", details: err });
        }
        res.status(200).json(result);
    });
}



module.exports ={
send_msg_controller,
get_msg_controller
}
module.exports = {
  myJsonify(regex, message) {
    try {
      let new_message = message.replace(regex, "");
      // console.log(new_message);
      return JSON.parse(String(new_message));
    } catch (error) {
      // console.log("message: " + message);
      return null;
    }
  },
  broadcast(wss, ws, message) {
    //send back the message to the other clients
    let new_message = message.replace(/^broadcast: /, "");
    wss.clients.forEach(client => {
      if (client != ws) {
        client.send(`broadcast -> ${new_message}`);
      }
    });
  },
  async dataCompile(req) {
    try {
      let data = req.toJSON();
      let response = {
        OK: true,
        data
      };
      return JSON.stringify(response);
    } catch (err) {
      throw err;
    }
  }
};

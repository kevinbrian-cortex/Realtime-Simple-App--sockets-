const express = require("express");
const path = require("path");
const { WebSocket } = require("ws");

const app = express(); //app

app.use("/", express.static(path.resolve(__dirname, "../client"))); //serve static files from public folder

app.get("/users", (req, res) => {
  res.send("users");
});

const server = app.listen(3000, () => {
  console.log("started running on port 3000");
});

//init set datastructure
const clients = new Set();

//init websocket server
const ws_server = new WebSocket.Server({ server }); //pass the http server as arg

//now we can start handling websocket connections

ws_server.on("connection", (ws) => {
  console.log("new connection");

  //add new client to the set
  clients.add(ws);

  ws.on("message", (msg) => {
    console.log("We receive a message");

    const jsonString = msg;
    const data = JSON.parse(msg);

    console.log(data);

    //loog through all clients and send the message
    for (const client of clients) {
      if (client !== ws) {
        // client.send("Your friend said :" + msg);
        client.send(JSON.stringify(data));
      }
    }
  });

  ws.on("close", () => {
    console.log("connection closed");
  });
});

const http = require("http")
const express = require("express")
const app = express()
const path = require("path")
const socketio = require("socket.io")
const randomColor = require("randomcolor")
const { text } = require("express")
const { Socket } = require("engine.io")
const fs = require('fs');
const { emit } = require("process")
app.use(express.static(path.join(__dirname+"/..", "client")))

const server = http.createServer(app);
const io = socketio(server)

io.on("connection", (sock) => {
  sock.emit("msgTC", "You are connected");
  //sock.leaveAll();
  sock.join("lobby")
  //console.log("player connected")
  const color = randomColor();
  sock.on("disconnecting", function () {
    const roomsIn = Array.from(sock.rooms)
    //console.log(roomsIn[1])
    sock.to(roomsIn[1]).emit("inRoom", roomsIn[1])
    const roomList = io.sockets.adapter.rooms.get(roomsIn[1]);
    const roomOcc = roomList ? roomList.size : 0;
    io.to(roomsIn[1]).emit("roomOccUpd", roomOcc-1)
    io.to(roomsIn[1]).emit("msgTC", "A PLAYER HAS LEFT THE ROOM")
  })
  sock.on("msgTS", function(text) {
    console.log(text)
    const roomsIn = Array.from(sock.rooms)
    console.log(roomsIn[0])
    console.log(roomsIn[1])
    io.to(roomsIn[1]).emit("msgTC", text)
    /*for(i=1;i<roomsIn.length;i++) {  
      console.log(roomsIn[i])        
      io.to(roomsIn[i]).emit("msgTC", text)
    }*/})
    
  sock.on("join", function (player, roomnnum) {  
    if(isNaN(roomnnum)==false) {
      var room="r"+roomnnum
    }
    else {
      var room = roomnnum
    }
    const roomList = io.sockets.adapter.rooms.get(room);
    //console.log(roomList)
    const roomOccupancy = roomList ? roomList.size : 0;
    //console.log(roomOccupancy)
    if (roomOccupancy < 2) {
      //sock.leaveAll();
      const roomIn = Array.from(sock.rooms)
      sock.leave(roomIn[1])
      sock.join(room)
      const roomListNew = io.sockets.adapter.rooms.get(room);
      const roomOccupancyNew = roomListNew ? roomListNew.size : 0;
      sock.emit("inRoom", room)
      io.to(room).emit("roomOccUpd", roomOccupancyNew)
      io.to(room).emit("pjoined", player, room)
      if (roomOccupancy == 1) {
        io.to(room).emit("room2occ")
      }
    }
    else {
      sock.emit("roomFull")
    }
    
  } )
  sock.on("gameStart", function (startCount) {
    console.log(startCount)
    const roomIn = Array.from(sock.rooms)
    io.to(roomIn[1]).emit("pStartUpd", startCount)
    if (startCount == 2) {
      const clientList = io.sockets.adapter.rooms.get(roomIn[1]);
      const cL = Array.from(clientList)
      console.log(cL)
      //io.sockets.connected[cL[0]].emit("pAssign", "x")
      //io.to(cL[1]).emit("pAssign", "o")
      io.to(roomIn[1]).emit("STCstart",fs.readFileSync(__dirname+"/board.html", "utf8"))
      io.to(cL[1]).emit("pAssign", "O")
      io.to(cL[0]).emit("pAssign", "X")
    }
  })
  sock.on("move", function (t,r,c,p) {
    const roomsIn = Array.from(sock.rooms)
    io.to(roomsIn[1]).emit("moveTC",t,r,c,p)
  })
  /*sock.on("gEnd", function (p) {
    const roomsIn = Array.from(sock.rooms)
    io.to(roomsIn[1]).emit("cEndProt", p)
  })*/
  sock.on("endSlct", function () {
    const roomsIn = Array.from(sock.rooms)
    sock.leave(roomsIn[1])
    sock.join("endBuffer")
    sock.emit("endSlctTC", roomsIn[1])
  })
})

server.on("error", (err) => {
    console.log("error")
})
  
server.listen(3000, () => {
    console.log("server is ready")
})



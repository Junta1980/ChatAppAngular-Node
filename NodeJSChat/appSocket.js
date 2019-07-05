const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)
var io = require('socket.io')(server);
const { addUser, getUser , removeUser , getUsersInRoom}  = require('./util/user')
const path = require('path')
const publicDirectoryPath = path.join(__dirname, './public')

app.use(express.static(publicDirectoryPath))

server.listen(8080);



io.on('connection', (socket) => {


  socket.on('join',  ( option , callback) => {
  
    const {error , user } = addUser(option , socket.id)
    

    if (error ) {
      return callback(error)
    } else {

       socket.join( user.room)
       io.to(user.room).emit( 'message' , "benvenuto " + user.name  + " nella room " + user.room )
       const userinroom =  getUsersInRoom(user.room)
       
       io.to(user.room).emit( 'room' , userinroom )
       callback()
    }   
    
  });  

  socket.on('message', function (message ) {
        const user = getUser(socket.id)
        if(user) {
        io.to(user.room).emit('message', user.username + '#' + message , user.username);
        }
    })

    socket.on('typing', function (usr ) {
      const user = getUser(socket.id)
      if(user) {
        socket.to(user.room).emit('typing', '...' + user.username + ' is typing' , user.username );
      }
  })

  socket.on('disconnect', () => {
      const user = removeUser(socket.id)
      if (user) {
          io.to(user.room).emit('message', user.username + " has left!")
        }
  })

})





const users = []

const addUser = ( option  , id) => {
  
  if (!option.name || !option.room) {
    return {
        error: 'Username and room are required!' ,   user : null 
    }
  } 

  username = option.name.trim()
  room = option.room.trim()

  

  const existingUser = users.find((user) => {
    return user.username === username && user.room === room
  })

  if(existingUser){
 
    return { error: 'Username is in use!' ,  user : null }
  }

  users.push({ id, username , room })
  return {  user : option} 
}

const getUser = (id) => {
  return users.find((user) => user.id === id)
}

const removeUser = (id) => {
  
  const index = users.findIndex((user) => user.id === id)

  if (index !== -1) {
      return users.splice(index, 1)[0]
  }
}


const getUsersInRoom = (room) => {
  room = room.trim()
  var userinroom = []
  let usr =  users.filter((user) => user.room === room)
  usr.forEach( (data) => { userinroom.push(data.username)} )
  return userinroom 
}

module.exports = {
  addUser,
  getUser ,
  removeUser,
  getUsersInRoom
}

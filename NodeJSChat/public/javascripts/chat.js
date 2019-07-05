const socket = io()

mess = []

function getParameterByName(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  var results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};


const autoscroll = () => {

  console.log($messages.lastElementChild)

  const $newMessage = $messages.lastElementChild

  const newMessageStyles = getComputedStyle($newMessage)
  const newMessageMargin = parseInt(newMessageStyles.marginBottom)
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin
  const visibleHeight = $messages.offsetHeight
  const containerHeight = $messages.scrollHeight

  const scrollOffset = $messages.scrollTop + visibleHeight

  if (containerHeight - newMessageHeight <= scrollOffset) {
      $winmessages.scrollTop = $messages.scrollHeight +20
  }
  window.scrollTo(0, document.body.scrollHeight);
}

// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $messages = document.querySelector('#messages')
const messageTemplate = document.querySelector('#message-template').innerHTML
const typeTemplate = document.querySelector('#type-template').innerHTML
const $type = document.querySelector('#type')
const userommtemplate = document.querySelector('#useromm-template').innerHTML
const $userdet = document.querySelector('#useromm')
var name = getParameterByName('username');
var room = getParameterByName('room');
const $sidebar = document.querySelector('#sidebar')
const userinrommtemplate = document.querySelector('#userrm-template').innerHTML
const $winmessages = document.querySelector('#winmessages')

socket.emit('join', { name, room }, (error) => {
  if (error) {
      alert(error)
      location.href = '/'
  } 

  const html = Mustache.render(userommtemplate ,{ user: name ,room: room  } )
  $userdet.insertAdjacentHTML('beforeend', html)

})

socket.on('message', (message , usrname ) => {
  
  const html = Mustache.render(messageTemplate ,{ message: message } )
  $messages.insertAdjacentHTML('beforeend', html)
  const rmtype = document.querySelector('#'+usrname )

  if(rmtype){
    rmtype.remove()
  }
  
  autoscroll()

})

socket.on('room', (data) => {
  

  const html = Mustache.render(userinrommtemplate ,{ users : data ,  room: room } )
  $sidebar.innerHTML = html


})

socket.on('typing', function (message , usrname ) {
  const html = Mustache.render(typeTemplate ,{ message: message , name : usrname  } )
  $type.insertAdjacentHTML('beforeend', html)
  setTimeout(function() {
    const rmtype = document.querySelector('#'+usrname )
    if(rmtype){
      rmtype.remove()
   }  
    }, 10000); 

    autoscroll()
});



$messageForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const message = e.target.elements.message.value
  socket.emit('message', message)
  $messageFormInput.value = ''
  $messageFormInput.focus()
})

var canPublish = true;

$messageFormInput.addEventListener('keyup' , (e) => {
  
  if(canPublish) {
    
    socket.emit('typing') 

    canPublish = false;

    setTimeout(function() {
      canPublish = true;
    }, 4000);  
   
  }

})

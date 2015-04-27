// YOUR CODE HERE:


var app ={
  // server: 'https://api.parse.com/1/classes/chatterbox',
  server: 'http://127.0.0.1:3000/classes/messages',
  roomList: {},
  friendList: {},

  init: function() {
    app.$roomSelect = $('#roomSelect');
    
    app.fetch();
    setInterval(app.fetch, 20000);
    
  },

  send: function(message) {
    $.ajax({
    // always use this url
    // url: 'https://api.parse.com/1/classes/chatterbox',
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
  },

  fetch: function() {
    $.ajax({
    // always use this url
    //url: 'https://api.parse.com/1/classes/chatterbox',
    url: app.server,
    type: 'GET',
    // data: {order: '-createdAt'},
    data: {},
    contentType: 'application/json',
    success: function (data) {
      app.clearMessages();
      _.each(data.results, function(value) {
        app.addMessage(value);
      });
    },

    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to fetch messages');
    }
    });
  },

  clearMessages: function() {
    $('#chats').empty();
  },

  addMessage: function(message) {
    var selectedRoom = $("#roomSelect option:selected").val();
    if (!selectedRoom) {
      selectedRoom = 'lobby';
    }

    // if (selectedRoom === message.roomname) {
      // if (app.friendList[message.username]) {
      //   $('#chats').append('<div class="chat"><p class="friend"> <span class="username" data-username>' + _.escape(message.username) + '</span> : ' + _.escape(message.message) + ' ' + '<span class="roomname" data-roomname>' + _.escape(message.roomname) + '</span></p></div>');
      //   $('.username').click( function(value) {
      //     app.addFriend(value.target);
      //   });
      // } else {
        $('#chats').append('<div class="chat"><p>' + '<span class="username" data-username>' + _.escape(message.username) + '</span> : ' + _.escape(message.message) + ' ' + '<span class="roomname" data-roomname>' + _.escape(message.roomname) + '</span></p></div>');
        $('.username').click( function(value) {
          app.addFriend(value.target);
        });
      // }
    // }
    app.addRoom(message.roomname);
  },

  addRoom: function(room) {
    if (room !== undefined && room !== '') {
      if (app.roomList[room] === undefined) {
        $('#roomSelect').append('<option value="' + room + '">' + room + '</option>');
        app.roomList[room] = true;
      }
    }
  },

  addFriend: function(evt) {
    var username = $(evt).text();
    app.friendList[username] = true;
  },

  handleSubmit: function(e) {
    e.preventDefault();

    var username = $('.username2').text();
    // var message = _.escape($('.message2').val());
    var message = $('.message2').val();
    // var room = $('#roomSelect').val();
    var room = app.$roomSelect.val();

    var messageObj = {
      // username: username,
      username: getUrlParameter('username'),
      message: message,
      roomname: room
    };
    console.log(messageObj);

    //  var messageObj = {
    //   username: 'Jennifer1',
    //   message: '1111',
    //   roomname: 'lobby'
    // };

    app.send(messageObj);
  }
  
};

function getUrlParameter(sParam) {
  var sPageURL = window.location.search.substring(1);
  var sURLVariables = sPageURL.split('&');
  for (var i = 0; i < sURLVariables.length; i++) {
      var sParameterName = sURLVariables[i].split('=');
      if (sParameterName[0] == sParam) {
        return sParameterName[1];
      }
  }
}  

$( document ).ready(function() {

    app.init();

    var whoami = getUrlParameter('username');
    $('.username2').text(whoami);
    

    $('.submit').click( function(event) {
        app.handleSubmit(event);
    });
});
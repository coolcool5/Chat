var socket = io();
var random = generate();
var home = [
  "Chat",
  "Welcome to Chat, a chat application.",
  "Chat rooms are created, joined and shared with the url, create your own chat room by changing the text after the question mark.",
  `If you wanted your chat room name to be 'your-chat’: <a href="?your-chat">${location.origin + "/?your-chat"}</a>`,
  "There are no chat room lists, so a secret chat room name can be used for private discussions.",
  "Here are some pre-made chat rooms you can join:",
  `<a href="?home">?home</a>&nbsp;<a href="?math">?math</a>&nbsp;<a href="?physics">?physics</a><br><a href="?chemistry">?chemistry</a>&nbsp;<a href="?programming">?programming</a>&nbsp;<a href="?games">?games</a>`,
  `And here’s a random one generated just for you: <a href="?${random}">?${random}</a>`,
  "No message history is kept on this chat's server.",
  `<a href="https://github.com/coolcool5/Chat">Github</a>`
];
for (var text of home) {
  var p = document.createElement("p");
  p.innerHTML = text;
  $("#home").appendChild(p);
}
function $(q) {
  return document.querySelector(q);
}
function generate() {
  var c = "qwertyuiopasdfghjklzxcvbnm1234567890";
  var s = "";
  for (var i = 0; i < 8; i++) {
    s += c.charAt(Math.floor(Math.random() * c.length));
  }
  return s;
}
if (location.search != "") {
  var room = location.search.substring(1, location.search.length);
  var nick;
  var color = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`;
  $("#home").hidden = true;
  $("#chat").hidden = false;
  var cookies = true;
  try {
    localStorage;
  } catch (error) {
    cookies = false;
  }
  while (nick == null || nick == "") {
    nick = prompt("Nickname:", cookies ? localStorage.name : undefined);
  }
  if (cookies) {
    localStorage.name = nick;
  }
  socket.emit("m", { m: `${nick} joined`, r: room });
  $("#message").addEventListener("keypress", function(event) {
    if (event.keyCode == 13 && $("#message").value.trim() != "") {
      socket.emit("m", { u: nick, c: color, m: $("#message").value, r: room });
      $("#message").value = "";
    }
  });
  socket.on(room, function(d) {
    var m = document.createElement("div");
    if (d.u != undefined) {
      var u = document.createElement("b");
      u.textContent = d.u;
      if (d.c != undefined) {
        u.style.color = d.c;
      }
      m.appendChild(u);
    } else {
      m.style.color = "green";
    }
    if (d.m != undefined) {
      var t = document.createElement("span");
      t.textContent = d.m;
      m.appendChild(t);
    }
    $("#chatroom").appendChild(m);
    $("#chatroom").scrollTop = $("#chatroom").scrollHeight;
  });
  onbeforeunload = function() {
    socket.emit("m", { m: `${nick} left`, r: room });
  };
}

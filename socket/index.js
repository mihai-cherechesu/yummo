import { Server } from "socket.io";

// const clientOrigin = "http://medissistance-fe:3000";
const clientOrigin = "http://localhost:3000";

const io = new Server({
  cors: {
    origin: clientOrigin
  }
});

let onlineClients = [];
let onlineCouriers = [];

const addNewUser = (email, role, socketId) => {
  if (role === "courier") {
    !onlineCouriers.some(user => user.email === email) && onlineCouriers.push({email, socketId});
  } else if (role === "client") {
    !onlineClients.some(user => user.email === email) && onlineClients.push({email, socketId});
  }
}

const removeUser = (socketId) => {
  onlineCouriers = onlineCouriers.filter(user => user.socketId !== socketId);
  onlineClients = onlineClients.filter(user => user.socketId !== socketId);
}

const removeUserByEmail = (email) => {
  console.log("Remove existing user from arrays: ");
  console.log(onlineClients);
  console.log(onlineCouriers);
  onlineCouriers = onlineCouriers.filter(user => user.email !== email);
  onlineClients = onlineClients.filter(user => user.email !== email); 
}

const getUser = (email, role) => {
  return (role === "courier") ? 
    onlineCouriers.find(user => user.email === email) :
    onlineClients.find(user => user.email === email);
}

io.on("connection", (socket) => {
  
  socket.on("newUser", ({email, role}) => {
    removeUserByEmail(email);
    addNewUser(email, role, socket.id);
    console.log(`Added new user: ${email}, ${role}`)
  });

  socket.on("sendOrder", ({email, orderId}) => {
    console.log("Send order from " + email + " on order: " + orderId)
    onlineClients.forEach((c) => {
        console.log("Send order notification to socket: ", c.socketId + " " + c.email);
        io.to(c.socketId).emit("getOrder", {
          email,
          orderId
        });
    })  
  })

  socket.on("orderAccepted", ({txEmail, rxEmail, orderId}) => {
    const rxUser = getUser(rxEmail, "client");
    io.to(rxUser.socketId).emit("notifyClientOrderAccepted", {
      txEmail, 
      orderId,
    })
  })

  socket.on("disconnect", () => {
    removeUser(socket.id);
  })
});

io.listen(5001);
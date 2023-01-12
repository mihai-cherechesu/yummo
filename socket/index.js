import { Server } from "socket.io";
import { createServer } from "http";

const clientOrigin = "https://a385e3b6d9ba543b79fdf9b46ae600f1-1114754256.eu-central-1.elb.amazonaws.com";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: clientOrigin
  },
});

const nsp = io.of("/socket/");

let onlineClients = [];
let onlineCouriers = [];

const addNewUser = (email, role, socketId) => {
  if (role === "courier") {
    !onlineCouriers.some(user => user.email === email) && onlineCouriers.push({email, socketId});
    process.stdout.write("Online couriers for " + email + ": " + onlineCouriers + "\n");
  } else if (role === "client") {
    !onlineClients.some(user => user.email === email) && onlineClients.push({email, socketId});
    process.stdout.write("Online clients for " + email + ": " + onlineClients + "\n");
  }
}

const removeUser = (socketId) => {
  onlineCouriers = onlineCouriers.filter(user => user.socketId !== socketId);
  onlineClients = onlineClients.filter(user => user.socketId !== socketId);
  process.stdout.write("[DISCONNECT] Remaining clients for " + socketId + ": " + onlineClients + "\n");
  process.stdout.write("[DISCONNECT] Remaining couriers for " + socketId + ": " + onlineCouriers + "\n");
}

const removeUserByEmail = (email) => {
  onlineCouriers = onlineCouriers.filter(user => user.email !== email);
  onlineClients = onlineClients.filter(user => user.email !== email);
  process.stdout.write("[NEWCONN] Remaining clients for " + email + ": " + onlineClients + "\n");
  process.stdout.write("[NEWCONN] Remaining couriers for " + email + ": " + onlineCouriers + "\n");
}

const getUser = (email, role) => {
  return (role === "courier") ? 
    onlineCouriers.find(user => user.email === email) :
    onlineClients.find(user => user.email === email);
}

nsp.on("connection", (socket) => {
  process.stdout.write("On connection!\n");

  socket.on("newUser", ({email, role}) => {
    process.stdout.write("On newUser: " + email + " " + role + "\n");

    removeUserByEmail(email);
    addNewUser(email, role, socket.id);
  });

  socket.on("sendOrder", ({email, orderId}) => {
    process.stdout.write("Received order from " + email + " on order: " + orderId + "\n");
    process.stdout.write("[RECVORDER] Remaining clients for: " + onlineClients + "\n");
    process.stdout.write("[RECVORDER] Remaining couriers for: " + onlineCouriers + "\n");

    onlineClients.forEach((c) => {
        process.stdout.write("Send order notification to socket: ", c.socketId + " " + c.email + "\n");
        nsp.to(c.socketId).emit("getOrder", {
          email,
          orderId
        });
    })  
  })

  socket.on("orderAccepted", ({txEmail, rxEmail, orderId}) => {
    const rxUser = getUser(rxEmail, "client");
    nsp.to(rxUser.socketId).emit("notifyClientOrderAccepted", {
      txEmail, 
      orderId,
    })
  })

  socket.on("disconnect", () => {
    process.stdout.write("Got disconnected: " + socket.id) + "\n";
    removeUser(socket.id);
  })
});

io.listen(5001);
import { Server } from "socket.io";
import { createServer } from "https";
import { readFileSync } from "fs";

const clientOrigin = "https://a385e3b6d9ba543b79fdf9b46ae600f1-1114754256.eu-central-1.elb.amazonaws.com";

const httpServer = createServer({
  cert: readFileSync("./certs/server.cert"),
  key: readFileSync("./certs/server.key"),
});
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
  } else if (role === "client") {
    !onlineClients.some(user => user.email === email) && onlineClients.push({email, socketId});
  }
}

const removeUser = (socketId) => {
  onlineCouriers = onlineCouriers.filter(user => user.socketId !== socketId);
  onlineClients = onlineClients.filter(user => user.socketId !== socketId);
}

const removeUserByEmail = (email) => {
  onlineCouriers = onlineCouriers.filter(user => user.email !== email);
  onlineClients = onlineClients.filter(user => user.email !== email); 
}

const getUser = (email, role) => {
  return (role === "courier") ? 
    onlineCouriers.find(user => user.email === email) :
    onlineClients.find(user => user.email === email);
}

nsp.on("connection", (socket) => {
  process.stdout.write("On connection!");

  socket.on("newUser", ({email, role}) => {
    process.stdout.write("On newUser: " + email + " " + role);

    removeUserByEmail(email);
    addNewUser(email, role, socket.id);
  });

  socket.on("sendOrder", ({email, orderId}) => {
    process.stdout.write("Send order from " + email + " on order: " + orderId);
    onlineClients.forEach((c) => {
        process.stdout.write("Send order notification to socket: ", c.socketId + " " + c.email);
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
    process.stdout.write("Got disconnected: " + socket.id);
    removeUser(socket.id);
  })
});

io.listen(5001);
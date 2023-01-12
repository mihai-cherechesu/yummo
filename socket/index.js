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
    printList("ADDNEWUSER, clients", onlineClients, email);
  } else if (role === "client") {
    !onlineClients.some(user => user.email === email) && onlineClients.push({email, socketId});
    printList("ADDNEWUSER, couriers", onlineCouriers, email);
  }
}

const printList = (event, list, str) => {
  process.stdout.write("[" + event + "]: for" + str + " [")
  list.forEach(function(v) {
    process.stdout.write("{email: " + v.email + ", socketId: " + v.socketId + "}, ")
  })
  process.stdout.write("]\n")
}

const removeUser = (socketId) => {
  onlineCouriers = onlineCouriers.filter(user => user.socketId !== socketId);
  onlineClients = onlineClients.filter(user => user.socketId !== socketId);
  printList("DISCONNECT, clients", onlineClients, socketId);
  printList("DISCONNECT, couriers", onlineCouriers, socketId);
}

const removeUserByEmail = (email) => {
  onlineCouriers = onlineCouriers.filter(user => user.email !== email);
  onlineClients = onlineClients.filter(user => user.email !== email);
  printList("NEWCONN, clients", onlineClients, email);
  printList("NEWCONN, couriers", onlineCouriers, email);
}

const getUser = (email, role) => {
  return (role === "courier") ? 
    onlineCouriers.find(user => user.email === email) :
    onlineClients.find(user => user.email === email);
}

nsp.on("connection", (socket) => {
  process.stdout.write("On connection!\n");

  socket.on("newUser", ({email, role}) => {
    process.stdout.write("[ONNEWUSER]: " + email + " " + role + "\n");

    removeUserByEmail(email);
    addNewUser(email, role, socket.id);
  });

  socket.on("sendOrder", ({email, orderId}) => {
    process.stdout.write("Received order from " + email + " on order: " + orderId + "\n");
    printList("RECVORDER, clients", onlineClients, email);
    printList("RECVORDER, couriers", onlineCouriers, email);

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
    process.stdout.write("Got disconnected: " + socket.id + "\n");
    removeUser(socket.id);
  })
});

io.listen(5001);
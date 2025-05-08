const socket = require("socket.io");

const intializeSocket = server => {
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173",
        },
    });

    io.on("connection", socket => {
        //handle socket events 
        socket.on("joinChat", () => {

        });

        socket.on("sendMessage", () => {
            
        });

        socket.on("disconnect", () => {
            
        });
    });
};

module.exports = intializeSocket;
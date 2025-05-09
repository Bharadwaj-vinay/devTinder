const socket = require("socket.io");
const crypto = require("crypto");

const getSecretRoomId = (userId, targetUserId) => {
    return crypto
        .createHash("sha256")
        .update([userId, targetUserId].sort().join("_"))
        .digest("hex");
};

const intializeSocket = server => { 
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173",
        },
    });

    io.on("connection", socket => {
        //handle socket events 
        socket.on("joinChat", ({userId, targetUserId}) => {
             const roomId = [userId, targetUserId].sort().join("_");
             console.log('joinchat roomid', roomId);

             //creating a unique chat room for these 2 users
             socket.join(roomId);
        });

        socket.on("sendMessage", 
            ({firstName, userId, targetUserId, text}) => {
                const roomId = getSecretRoomId(userId, targetUserId);
                console.log('sendmsg roomid', roomId);
                io.to(roomId).emit("messageReceived", {text, firstName});
        });

        socket.on("disconnect", () => {
            
        });
    });
};

module.exports = intializeSocket;
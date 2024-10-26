import { saveDocument } from "../contoller/document.controller.js"
export async function handleSocketDocument(io) {
    const connectedClients = new Map();

    io.on('connection' , (socket) => {

        socket.on("joinDocument", (docid) => {
            socket.join(docid);
            
            if (!connectedClients.has(docid)) {
                connectedClients.set(docid, new Set());
            }
            connectedClients.get(docid).add(socket.id);
            
            // Notify others about new connection
            socket.to(docid).emit("userJoined", {
                connectedUsers: connectedClients.get(docid).size
            });
            console.log("Connected client");
            console.log(connectedClients.get(docid).size);
        });

        socket.on('updatedDataFromTheClient' , async (data) => {
            try {
                const response = await saveDocument(data.id , data.userid , data.content , data.sharedWith);
                socket.to(data.id).emit("serverResponse" , {
                    status:200,
                    document:response
                });
            } catch (error) {
                socket.to(data.id).emit("serverResponse", {
                    status:500,
                    document:error 
                })
            }
        })
    })
};
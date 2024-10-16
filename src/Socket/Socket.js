import { saveDocument } from "../contoller/document.controller.js"
export async function handleSocketDocument(io) {
    io.on('connection' , (socket) => {
        socket.on('updatedDataFromTheClient' , async (data) => {
            try {
                console.log(data);
                
                const response = await saveDocument(data.id , data.userid , data.content , data.sharedWith);
                socket.emit("serverResponse" , {
                    status:200,
                    document:response
                });
            } catch (error) {
                socket.emit("serverResponse", {
                    status:500,
                    document:error 
                })
            }
        })
    })
};
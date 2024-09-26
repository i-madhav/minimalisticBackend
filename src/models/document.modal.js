import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
    content: {
        type: String
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    sharedWith: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "User"
        }]
}, { timestamps: true })

export const Document = mongoose.model("Document", documentSchema);
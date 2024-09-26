import { Document } from "../models/document.modal";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import { asyncHandler } from "../utils/AsyncHandler";

const generateAndSaveDocument = asyncHandler(async (req, res) => {
    const { id, content, userid } = req.body;
    if (id && userid) {

    } else if (id) {

    } else if (userid && !id) {

    } else if (!userid && !id) {
        // user is not logged in and is trying to create a document
        // document modal will only have a id and content which is empty 
        // and we will send id to the client

        const document = await Document.create({
            content: ""
        });

        if (!document) throw new ApiError(500, "unable to create document");

        return res.status(200)
            .json(new ApiResponse(200, "document created successfully", document))
    }
})


const fetchDocument = asyncHandler(async (req, res) => {
    const type = req.query.type;
    if (type === "LoggedInUser") {

    } else if (type === "NonLoggedInUser") {
        const { id } = req.body;
        
    }
})
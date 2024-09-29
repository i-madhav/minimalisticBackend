import { Document } from "../models/document.modal";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import { asyncHandler } from "../utils/AsyncHandler";

const generateAndSaveDocument = asyncHandler(async (req, res) => {
    const { id, content, userid } = req.body;

    if (userid && !id) {
        // document creation for logged-in user
        const document = await Document.create({
            content:" ",
            owner:userid
        });

        if(!document) throw new ApiError(500 , "unable to create document");
        return res.status(200).json(200,"document created successfully for logged-in user",  document);

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
});

const saveDocument = asyncHandler(async(req,res) => {
    if (id && userid) {
        // for logged in
        // for save document
    } else if (id) {
        // for non logged-in user
        // save document
    }
})


const fetchDocument = asyncHandler(async (req, res) => {
    const type = req.query.type;
    if (type === "LoggedInUser") {

    } else if (type === "NonLoggedInUser") {
        const { id } = req.body;
        
    }
});

const numberDocumentUserCreated = asyncHandler(async(req , res) => {

})
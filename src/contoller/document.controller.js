import { Document } from "../models/document.modal.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

const generateDocument = asyncHandler(async (req, res) => {
    const { id, userid } = req.body;

    if (userid && !id) {
        // document creation for logged-in user
        const document = await Document.create({
            content: " ",
            owner: userid
        });

        if (!document) throw new ApiError(500, "unable to create document");
        return res.status(200).json(200, "document created successfully for logged-in user", document);

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

const saveDocument = async (id, userid, content, sharedWith) => {
    if (id && userid && sharedWith.length > 0) {
        // for logged in and he has restricted document to shared only
        // for save document
        const documentContent = await Document.findById(id);
        if (!documentContent) throw new ApiError(404, "Document not found");
        const isOwner = documentContent.owner.equals(userid);
        const isSharedWith = documentContent.sharedWith.some((item) => item.equals(userid));
        if (isOwner || isSharedWith) {
            documentContent.content = content;
            await documentContent.save({ validateBeforeSave: false });
            return documentContent;
        }else{
            return "You do not have access to this document"
        }
    } else if (id && content) {
        // for non logged-in user and logged user too if document is not in sharedwith mode 
        // save document
        const dataContent = await Document.findById(id);
        if (!dataContent) throw new ApiError(404, "couldn't find the document");

        dataContent.content = content;
        await dataContent.save({ validateBeforeSave: false });
        return dataContent;
    }
};


// sharedwith will be handled in fetch documentbecause if a shared with is being used then if a non shared user try access the document , the document won't even get fetched to him!!
const fetchDocument = asyncHandler(async (req, res) => {
    const type = req.query.type;
    if (type === "LoggedInUser") {

    } else if (type === "NonLoggedInUser") {
        const { id } = req.body;

    }
});

const numberDocumentUserCreated = asyncHandler(async (req, res) => {
    const docs = await Document.find({ owner: req.user._id }).populate('owner');
    return res.status(200).json(new ApiResponse(200, "Number Document Fetched"), docs)
})


export { generateDocument, saveDocument, fetchDocument, numberDocumentUserCreated }
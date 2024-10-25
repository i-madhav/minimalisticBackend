import req from "express/lib/request.js";
import { Document } from "../models/document.modal.js";
import { User } from "../models/user.modal.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

const generateDocument = asyncHandler(async (req, res) => {
    const { id, userid } = req.body;
    if (userid && !id) {
        const document = await Document.create({
            content: " ",
            owner: userid
        });
        if (!document) throw new ApiError(500, "unable to create document");
        
        return res.status(200)
        .json(new ApiResponse(200, "document created successfully", document))

    } else if (!userid && !id) {
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
        const documentContent = await Document.findById(id);
        if (!documentContent) throw new ApiError(404, "Document not found");
        const isOwner = documentContent.owner.equals(userid);
        const isSharedWith = documentContent.sharedWith.some((item) => item.equals(userid));
        if (isOwner || isSharedWith) {
            documentContent.content = content;
            await documentContent.save({ validateBeforeSave: false });
            return documentContent;
        } else {
            return "You do not have access to this document"
        }
    } else if (id && content) {
        const dataContent = await Document.findById(id);
        if (!dataContent) throw new ApiError(404, "couldn't find the document");
        dataContent.content = content;
        await dataContent.save({ validateBeforeSave: false });
        return dataContent;
    }
};

const fetchDocument = asyncHandler(async (req, res) => {
    const type = req.query.type;
    if (type === "LoggedInUser") {
        const { id, userid } = req.body;
        const document = await Document.findById(id);
        if (document.sharedWith.length === 0) {
            return res.status(200).json(new ApiResponse(200, "document information is fetched you special g", document));
        } else {
            const isOwner = await User.findById(userid);
            const Owner = document.owner.equals(isOwner._id);
            const isSharedwith = document.sharedWith.some((item) => item.equals(userid))
            const shareWithEmail = await Promise.all(
                document.sharedWith.map(async (item) => {
                    const user = await User.findById(item);
                    return user.email;
                })
            );
            console.log(`isOwner ${isOwner} Owner ${Owner} isSharedWith ${isSharedwith}`);
            if (!Owner || !isSharedwith) throw new ApiError(403, "you do not have access to the document");
            if (Owner || isSharedwith) {
                if(shareWithEmail.length > 0){
                    const response = {document,shareWithEmail};
                    return res.status(200).json(new ApiResponse(200, "document information is fetched", response));
                }else{
                    const response = {document:document};
                    return res.status(200).json(new ApiResponse(200, "document information is fetched", response));
                }
            }
        }
    } else if (type === "NonLoggedInUser") {
        const { id } = req.body;
        const document = await Document.findById(id).select("-owner");
        if (document.sharedWith.length !== 0) {
            throw new ApiError(403, "You do not have access to this document");
        }
        if (!document) throw new ApiError(404, "document doesn't exist");
        return res.status(200).json(new ApiResponse(200, "document fetched", document))
    }
});

const addSharedWithToDocument = asyncHandler(async (req, res) => {
    const { id, userid, shareWith } = req.body;
    if (userid != req.user._id) throw new ApiError(500, "You do not have permission to perform this action");
    const document = await Document.findById(id);
    if (!document) throw new ApiError(404, "couldn't find document");
    const sharewithguy = await User.findOne({ email: shareWith });
    if (!sharewithguy) throw new ApiError(404, "User you are trying to add is not signed in , please make sure user is a existing user of the document");
    const user = await User.findById(userid);
    document.owner = user._id;
    document.sharedWith.push(sharewithguy._id);
    await document.save({ validateBeforeSave: false });
    return res.status(200).json(new ApiResponse(200, "sharedwith_user added successfully", document));
})

const numberDocumentUserCreated = asyncHandler(async (req, res) => {
    const docs = await Document.find({ owner: req.user._id }).populate('owner');
    if (docs.length == 0) throw new ApiError(404, "No Document Found");
    return res.status(200).json(new ApiResponse(200, "Number Document Fetched"), docs)
});


export { generateDocument, saveDocument, fetchDocument, numberDocumentUserCreated, addSharedWithToDocument };
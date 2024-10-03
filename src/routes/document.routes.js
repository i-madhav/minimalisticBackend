import { Router } from "express";
import { addSharedWithToDocument, fetchDocument, generateDocument, numberDocumentUserCreated } from "../contoller/document.controller.js";
import { AuthenticateUser } from "../middleware/Auth.middleware.js";
const routerDocument = Router();

routerDocument.route("/generate").post(generateDocument);
routerDocument.route("/fetch").post(fetchDocument);

// protected route
routerDocument.route("/user").get(AuthenticateUser,numberDocumentUserCreated)
routerDocument.route("/sharedwith/add").post(AuthenticateUser , addSharedWithToDocument);

export default routerDocument;
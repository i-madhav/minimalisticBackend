import { Router } from "express";
import { fetchDocument, generateDocument, numberDocumentUserCreated } from "../contoller/document.controller.js";
import { AuthenticateUser } from "../middleware/Auth.middleware.js";
const routerDocument = Router();

routerDocument.route("/generate").post(generateDocument);
routerDocument.route("/fetch").post(fetchDocument);

// protected route
routerDocument.route("/user").get(AuthenticateUser,numberDocumentUserCreated)

export default routerDocument;
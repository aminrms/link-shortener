import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validateBody, validateParams } from "../middlewares/validate.middleware.js";
import { createLinkSchema, linkIdParamsSchema } from "../validators/link.validators.js";
import { linkController } from "../controllers/link.controller.js";

export const linkRouter = Router();

linkRouter.use(authenticate)

linkRouter.get("/",linkController.getAllOfLinks);

linkRouter.post("/",
    validateBody(createLinkSchema),
    linkController.createLink
);

linkRouter.delete(
    "/:id",
    validateParams(linkIdParamsSchema),
    linkController.deleteLink
);
import { Router } from "express";
import { validateBody } from "../middlewares/validate.middleware.js";
import { loginShchema, registerSchema } from "../validators/auth.validators.js";
import { authController, AuthController } from "../controllers/auth.controller.js";

export const authRouter = Router();


authRouter.post(
    "/register",
    validateBody(registerSchema), 
    authController.register
)

authRouter.post(
    "/login", 
    validateBody(loginShchema),
    authController.login
)
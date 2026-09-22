import type { Request, Response } from "express"
import *  as  userService from "../services/auth.service.js";
import HttpStatusCode from "../constants/http-status-codes.js";
import { responseGenerator } from "../utils/response.js";




export class AuthController {

    async register(req: Request, res: Response) {
        const body = req?.body;
        const email = body?.email || null;
        const password = body?.password || null;

        try {
            const result = await userService.register(email, password)

            return responseGenerator.success(res, {
                status_code: HttpStatusCode.CREATED,
                message: "User is signed up",
                data: result,
            })
        } catch (err) {
            return responseGenerator.error(res, {
                status_code: HttpStatusCode.BAD_REQUEST,
                error: err,
            })
        }
    }

     async login (req: Request, res: Response) {
        const body = req?.body;
        const email = body?.email || null;
        const password = body?.password || null;

        if (!email || email?.trim()?.length === 0 || !password) {
            return responseGenerator.error(res, {
                status_code: HttpStatusCode.UNPROCESSABLE_ENTITY,
                error: "The email or password is required",
            })
        }
        try {
            const result = await userService.login(email, password)

            return responseGenerator.success(res, {
                status_code: HttpStatusCode.OK,
                message: "User is signed in",
                data: result,
            })
        } catch (err) {
            return responseGenerator.error(res, {
                status_code: HttpStatusCode.BAD_REQUEST,
                error: err,
            })
        }
    }

}

export const authController = new AuthController();
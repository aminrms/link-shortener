import type { Request, Response } from "express";
import * as linkService from "../services/link.service.js";
import HttpStatusCode from "../constants/http-status-codes.js";
import { responseGenerator } from "../utils/response.js";

class LinkController {
  getAllOfLinks = async (req: Request, res: Response) => {
    try {
      const userId = req.user_id;

      const result = await linkService.getAllOfLinks(userId);

      return responseGenerator.success(res, {
        status_code: HttpStatusCode.OK,
        message: "Links retrieved successfully",
        data: {
          results: result,
        },
      });
    } catch (err) {
      return responseGenerator.error(res, {
        status_code: HttpStatusCode.BAD_REQUEST,
        error: err,
      });
    }
  };

  redirectLink = async (req: Request, res: Response) => {
    try {
      const shortCode = req.params.sc!;

      const result =
        await linkService.getOriginialLinkByShortcode(shortCode as string);

      return res.redirect(result.original_url);
    } catch (err) {
      return responseGenerator.error(res, {
        status_code: HttpStatusCode.NOT_FOUND,
        error: err,
      });
    }
  };

  createLink = async (req: Request, res: Response) => {
    try {
      const originalUrl = req.body.original_url;
      const userId = req.user_id;

      const origin = `${req.protocol}://${req.get("host")}`;

      const link = await linkService.createLink(
        originalUrl,
        origin,
        userId,
      );

      return responseGenerator.success(res, {
        status_code: HttpStatusCode.CREATED,
        message: "Link created successfully",
        data: link,
      });
    } catch (err) {
      return responseGenerator.error(res, {
        status_code: HttpStatusCode.BAD_REQUEST,
        error: err,
      });
    }
  };

  deleteLink = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const userId = req.user_id;

      await linkService.deleteLink(id, userId);

      return responseGenerator.success(res, {
        status_code: HttpStatusCode.OK,
        message: "Deleted",
        data: null,
      });
    } catch (err) {
      return responseGenerator.error(res, {
        status_code: HttpStatusCode.BAD_REQUEST,
        error: err,
      });
    }
  };
}

export const linkController = new LinkController();
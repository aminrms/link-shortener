import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import HttpStatusCode from "../constants/http-status-codes.js";
import { env } from "../config/env.js";

type JwtPayload = {
  user_id: number;
};

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(HttpStatusCode.UNAUTHORIZED).json({
      message: "authorization is required",
    });
  }

  const [schema, token] = authorization.split(" ");

  if (
    !schema ||
    schema.trim().length === 0 ||
    !token ||
    token.trim().length === 0
  ) {
    return res.status(HttpStatusCode.UNAUTHORIZED).json({
      message: "invalid authorization header",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      env.JWT_SECRET as string
    ) as JwtPayload;

    if (!decoded?.user_id) {
      return res.status(HttpStatusCode.UNAUTHORIZED).json({
        message: "invalid authorization token",
      });
    }

    req.user_id = decoded.user_id;
    next();
  } catch {
    return res.status(HttpStatusCode.UNAUTHORIZED).json({
      message: "invalid or expired token",
    });
  }
};
import { z } from "zod";

export const createLinkSchema = z.object({
  original_url: z.url({
    message: "original_url must be a valid URL",
  }),
});

export const updateLinkSchema = z.object({
  original_url: z.url({
    message: "original_url must be a valid URL",
  }),
});

export const linkIdParamsSchema = z.object({
  id: z.coerce
    .number({
      message: "id must be a number",
    })
    .int()
    .positive("id must be positive"),
});

export const shortCodeParamsSchema = z.object({
  sc: z
    .string()
    .trim()
    .min(1, "short code is required"),
});
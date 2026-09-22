import { randomBytes } from "node:crypto";
import { prisma } from "../lib/prisma.js";

const generateShortCode = (): string => {
  return randomBytes(4).toString("base64url");
};

export const getAllOfLinks = async (userId: number) => {
  return prisma.link.findMany({
    where: { user_id: userId },
    orderBy: { created_at: "desc" },
  });
};

export const getOriginialLinkByShortcode = async (shortcode: string) => {
  const result = await prisma.link.findFirst({
    where: { short_code: shortcode },
  });

  if (!result) {
    throw new Error("The link is not found");
  }

  await prisma.link.update({
    where: { id: result.id },
    data: { clicks: { increment: 1 } },
  });

  return result;
};

export const createLink = async (
  originalUrl: string,
  origin: string,
  userId: number
) => {
  let shortCode = generateShortCode();

  while (
    await prisma.link.findUnique({
      where: { short_code: shortCode },
    })
  ) {
    shortCode = generateShortCode();
  }

  return prisma.link.create({
    data: {
      original_url: originalUrl,
      short_code: shortCode,
      short_link: `${origin}/${shortCode}`,
      user_id: userId,
    },
  });
};

export const deleteLink = async (id: number, userId: number) => {
  const { count } = await prisma.link.deleteMany({
    where: { id, user_id: userId },
  });

  if (count === 0) {
    throw new Error("Link not found or not yours");
  }
};

export const getLinkById = async (id: number, userId: number) => {
  return prisma.link.findFirst({
    where: { id, user_id: userId },
  });
};
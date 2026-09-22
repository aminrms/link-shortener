import { PrismaPg } from "@prisma/adapter-pg"
import { env } from "../config/env.js";
import { PrismaClient } from "../generated/prisma/client.js";

if(!env.DATABASE_URL) {
    throw new Error("Data base url is not defined");
}

const adapter = new PrismaPg({
    connectionString:env.DATABASE_URL
})

export const prisma = new PrismaClient({
    adapter
})
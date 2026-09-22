import "dotenv/config"

const PORT = process.env.PORT
const JWT_SECRET = process.env.JWT_SECRET
const DATABASE_URL = process.env.DATABASE_URL;
const CORS_ORIGINS = "*"

export const env ={
    PORT,
    JWT_SECRET,
    DATABASE_URL,
    CORS_ORIGINS
} 
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { env } from "../config/env.js";




if (!env.JWT_SECRET) {
    throw new Error("JWT secret is not defined");
}

export const register = async (
    email: string,
    password: string
) => {
    const findUser = await prisma.user.findFirst({
        where: {
            email
        }
    })
    if (findUser) {
        throw new Error("This is email already exist");
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
        }
    })
    const token = jwt.sign(
        {
            user_id: result?.id
        },
        env.JWT_SECRET as string,
        {
            expiresIn: "2d"
        }
    );


    const {password:rPasssword , ...safeResult} = result;

    return {
        user: safeResult,
        access_token: token
    }
}


export const login = async (email: string, password: string) => {
    const findUser = await prisma.user.findFirst({
        where: {
            email
        },
    });
    if (!findUser) {
        throw new Error("Invalid email or password");
    }

    const verfiedPassword = await bcrypt.compare(
        password,
        findUser?.password
    )

    if(!verfiedPassword){
        throw new Error("Inavlid email or password")
    }

    const token = jwt.sign(
        {
            user_id:findUser?.id
        },
        env.JWT_SECRET as string,
        {
            expiresIn:"2d"
        }
    );
    
    const {password:_, ...safeUser}= findUser;
    return {
        user:safeUser,
        access_token:token
    }
} 

import {email, z} from 'zod';


export const registerSchema = z.object({
    email:z.email(),
    password:z.string().min(8,"Password must be at least 8 characters")
})

export const loginShchema = z.object({
    email:z.email(),
    password: z.string().min(1, "Password is required"),
})
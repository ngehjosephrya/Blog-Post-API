import {config} from 'dotenv'

config({ path: `.env.${process.env.NODE_ENV || 'development'}.local`});

export const {
    PORT,
    NODE_ENV,
    JWT_SECRET,
    JWT_EXPIRES_IN,
    SERVER_URL,
    DATABASE_URL,
    CLIENT_URL,
    CLOUDINARY_NAME, 
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
} = process.env;
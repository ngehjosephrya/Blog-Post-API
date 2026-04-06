import {config} from 'dotenv'

config({ path: `.env.${process.env.NODE_ENV || 'development'}.local`});

export const {
    PORT,
    NODE_ENV,
    JWT_SECRET,
    JWT_EXPIRES_IN,
    SERVER_URL,
    DATABASE_URL,
} = process.env;
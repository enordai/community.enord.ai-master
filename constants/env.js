import dotenv from 'dotenv'

dotenv.config()

export const DATABASE_NAME = process.env.DATABASE_NAME
export const DATABASE_HOST = process.env.DATABASE_HOST
export const DATABASE_USER = process.env.DATABASE_USER
export const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD
export const SECRET_API_KEY = process.env.SECRET_API_KEY
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
export const REFRESH_TOKEN = process.env.REFRESH_TOKEN

export const MAIL_ID = process.env.MAIL_ID
export const MAIL_ID_PASSWORD = process.env.MAIL_ID_PASSWORD

export const MAIL_SERVICE = process.env.MAIL_SERVICE
export const MAIL_HOST = process.env.MAIL_HOST
export const PASSWORD_RESET_MAIL_TITLE = process.env.PASSWORD_RESET_MAIL_TITLE

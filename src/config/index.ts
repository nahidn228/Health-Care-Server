import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  salt_round: process.env.SALT_ROUND,
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },
  jwt: {
    jwt_secret: process.env.JWT_SECRET,
    jwt_expiresIn: process.env.JWT_EXPIRES,
    reset_pass_secret: process.env.JWT_RESET_PASS_SECRET,
    reset_pass_token_expires_in: process.env.JWT_RESET_PASS_TOKEN_EXPIRES,
  },
  reset_pass_link: process.env.RESET_PASS_LINK,
  openRouter: {
    api_key: process.env.OPEN_ROUTER_API_KEY,
  },
  stripe: {
    secret_key: process.env.STRIPE_SECRET_KEY,
    webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
  },
  smtp:{
    host: process.env.SMTP_HOST
    port: process.env.SMTP_PORT
    user: process.env.SMTP_USER
    pass: process.env.SMTP_PASS
  }
};

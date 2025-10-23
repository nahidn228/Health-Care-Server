import Stripe from "stripe";
import config from "../../config";



// ✅ Initialize Stripe
export const stripe = new Stripe(config.stripe.secret_key as string);
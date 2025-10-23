import { Request, Response } from "express";
import Stripe from "stripe";

import { PaymentService } from "./payment.service";
import { stripe } from "../../helper/stripe";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import config from "../../../config";



const endpointSecret = config.stripe.webhook_secret as string;

const handleStripeWebhook = catchAsync(async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    // Verify Stripe event
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err: any) {
    console.error("⚠️ Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // try {
  //   // Handle event logic in service
  //   await PaymentService.handleStripeWebhook(event);
  //   res.status(200).send("✅ Webhook received successfully");
  // } catch (error) {
  //   console.error("Error processing webhook:", error);
  //   res.status(500).send("Internal Server Error");
  // }

  const result = await PaymentService.handleStripeWebhook(event);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Webhook received successfully!",
    data: result,
  });
});

// const handleStripeWebhook = async (req: Request, res: Response) => {
//   const sig = req.headers["stripe-signature"] as string;

//   let event: Stripe.Event;

//   try {
//     // Verify Stripe event
//     event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
//   } catch (err: any) {
//     console.error("⚠️ Webhook signature verification failed.", err.message);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   try {
//     // Handle event logic in service
//     await PaymentService.handleStripeWebhook(event);
//     res.status(200).send("✅ Webhook received successfully");
//   } catch (error) {
//     console.error("Error processing webhook:", error);
//     res.status(500).send("Internal Server Error");
//   }
// };

export const PaymentController = {
  handleStripeWebhook,
};

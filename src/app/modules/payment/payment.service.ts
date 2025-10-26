import Stripe from "stripe";
import { prisma } from "../../shared/prisma";
import { PaymentStatus, Prisma, UserRole } from "@prisma/client";
import { IJwtPayload } from "../../type/common";
import { IOptions, paginationHelper } from "../../helper/pagginationHelper";

const handleStripeWebhook = async (event: Stripe.Event) => {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      const userEmail = session.customer_email;
      const appointmentId = session.metadata?.appointmentId;
      const paymentId = session.metadata?.paymentId;

      await prisma.appointment.update({
        where: {
          id: appointmentId,
        },
        data: {
          paymentStatus:
            session.payment_status === "paid"
              ? PaymentStatus.PAID
              : PaymentStatus.UNPAID,
        },
      });

      await prisma.payment.update({
        where: {
          id: paymentId,
        },
        data: {
          status:
            session.payment_status === "paid"
              ? PaymentStatus.PAID
              : PaymentStatus.UNPAID,

          paymentGatewayData: JSON.parse(JSON.stringify(session)),
        },
      });

      break;
    }

    case "payment_intent.payment_failed": {
      const intent = event.data.object as Stripe.PaymentIntent;
      console.log("❌ Payment failed:", intent.id);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
};









export const PaymentService = {
  handleStripeWebhook,

};

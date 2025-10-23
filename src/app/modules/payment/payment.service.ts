import Stripe from "stripe";



const handleStripeWebhook = async (event: Stripe.Event) => {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      // You can extract metadata if you added it during session creation
      const appointmentId = session.metadata?.appointmentId;
      const userEmail = session.customer_email;

      console.log("✅ Payment successful for appointment:", appointmentId);

      // Example: update appointment in DB
      // await AppointmentModel.updateOne(
      //   { _id: appointmentId },
      //   { paymentStatus: "paid", paymentId: session.id }
      // );

      // Example: send confirmation email
      // await sendPaymentSuccessEmail(userEmail, appointmentId);

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

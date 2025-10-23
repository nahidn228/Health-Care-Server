import { stripe } from "../../helper/stripe";
import { prisma } from "../../shared/prisma";
import { IJwtPayload } from "../../type/common";
import { v4 as uuidv4 } from "uuid";

const createAppointment = async (
  user: IJwtPayload,
  payload: { doctorId: string; scheduleId: string }
) => {
  console.log({ user, payload });

  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: payload.doctorId,
      isDeleted: false,
    },
  });
  const isBooked = await prisma.doctorSchedules.findFirstOrThrow({
    where: {
      doctorId: payload.doctorId,
      scheduleId: payload.scheduleId,
      isBooked: false,
    },
  });
  const videoCallingId = uuidv4();

  const result = await prisma.$transaction(async (tx) => {
    const appointmentData = await tx.appointment.create({
      data: {
        patientId: patientData.id,
        doctorId: doctorData.id,
        scheduleId: isBooked.scheduleId,
        videoCallingId,
      },
    });

    await tx.doctorSchedules.update({
      where: {
        doctorId_scheduleId: {
          doctorId: doctorData.id,
          scheduleId: isBooked.scheduleId,
        },
      },
      data: {
        isBooked: true,
      },
    });

    const transactionId = uuidv4();

    await tx.payment.create({
      data: {
        appointmentId: appointmentData.id,
        amount: doctorData.appointmentFee,
        transactionId,
      },
    });

    // 💰 Create Stripe Checkout Sessions
 

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Appointment with ${doctorData.name}`,
              description: `Consultation with ${doctorData.name}`,
            },
            unit_amount: Math.round(doctorData.appointmentFee * 100), // convert dollars → cents
          },
          quantity: 1,
        },
      ],
      success_url: `https://nahidhasan-portfolio.vercel.app/`,
      cancel_url: `https://www.linkedin.com/in/nahid-hasan01/`,
    });


    console.log("from Appointment session", session)

    return appointmentData;
  });

  return result;
};

export const AppointmentService = {
  createAppointment,
};

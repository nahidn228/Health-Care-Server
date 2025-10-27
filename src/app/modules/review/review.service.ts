import httpStatus from "http-status";

import ApiError from "../../error/apiError";
import { prisma } from "../../shared/prisma";
import { IJwtPayload } from "../../type/common";

const createReview = async (user: IJwtPayload, payload: any) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });
  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: payload.appointmentId,
    },
  });

  if (patientData.id !== appointmentData.id) {
    throw new ApiError(httpStatus.BAD_REQUEST, "This is not Your Appointment ");
  }
};

export const ReviewService = {
  createReview,
};

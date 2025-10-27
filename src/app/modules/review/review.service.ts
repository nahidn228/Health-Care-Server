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

  return await prisma.$transaction(async (tx) => {
    const result = await tx.review.create({
      data: {
        appointmentId: appointmentData.id,
        patientId: patientData.id,
        doctorId: appointmentData.doctorId,
        rating: payload.rating,
        comment: payload.comment,
      },
    });
    const avgRating = await tx.review.aggregate({
      _avg: {
        rating: true,
      },
      where: {
        doctorId: appointmentData.doctorId,
      },
    });

    await tx.doctor.update({
      where: {
        id: appointmentData.doctorId,
      },
      data: {
        averageRating: avgRating._avg.rating as number,
      },
    });

    return result;
  });
};

export const ReviewService = {
  createReview,
};

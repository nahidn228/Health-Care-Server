import { prisma } from "../../shared/prisma";
import { IJwtPayload } from "../../type/common";

const createAppointment = async (
  user: IJwtPayload,
  payload: { doctorId: string; scheduleId: string }
) => {
  console.log({ user, payload });

  await prisma.$transaction(async (tx) => {
    const patientData = await tx.user.findUniqueOrThrow({
      where: {
        email: user.email,
      },
    });
    const doctorData = await tx.doctor.findUniqueOrThrow({
      where: {
        id: payload.doctorId,
        isDeleted: false,
      },
    });
    const isBooked = await tx.doctorSchedules.findFirstOrThrow({
      where: {
        doctorId: payload.doctorId,
        scheduleId: payload.scheduleId,
        isBooked: false,
      },
    });
  });

  return {
    user,
    payload,
  };
};

export const AppointmentService = {
  createAppointment,
};

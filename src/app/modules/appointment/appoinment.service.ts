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
    const createAppointment = await tx.appointment.create({
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
    return createAppointment;
  });

  return result;
};

export const AppointmentService = {
  createAppointment,
};

import httpStatus from "http-status";
import { PaymentStatus, UserRole } from "@prisma/client";
import { IJwtPayload } from "../../type/common";
import ApiError from "../../error/apiError";
import { prisma } from "../../shared/prisma";

const fetchDashboardMetaData = async (user: IJwtPayload) => {
  let metaData;
  switch (user.role) {
    case UserRole.ADMIN:
      metaData = "Admin MetaData";
      break;
    case UserRole.DOCTOR:
      metaData = "Doctor MetaData";
      break;
    case UserRole.PATIENT:
      metaData = "Patient MetaData";
      break;

    default:
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid User Role");
  }

  return metaData;
};



const getAdminMetaData = async () => {
    const patientCount = await prisma.patient.count();
    const doctorCount = await prisma.doctor.count();
    const adminCount = await prisma.admin.count();
    const appointmentCount = await prisma.appointment.count()
    const paymentCount = await prisma.payment.count()

    const totalRevenue = await prisma.payment.aggregate({
        _sum: {
            amount: true
        },
        where: {
            status: PaymentStatus.PAID
        }
    })

    const barChartData = await getBarChartData();
    const pieChartData = await getPieChartData();

    return {
        patientCount,
        doctorCount,
        adminCount,
        appointmentCount,
        paymentCount,
        totalRevenue,
        barChartData,
        pieChartData
    }

}












export const MetaService = {
  fetchDashboardMetaData,
};

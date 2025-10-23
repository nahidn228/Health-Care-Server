import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { AppointmentService } from "./appoinment.service";
import { IJwtPayload } from "../../type/common";

const createAppointment = catchAsync(
  async (req: Request & { user?: IJwtPayload }, res: Response) => {
    const user = req.user;

    const result = await AppointmentService.createAppointment(user as IJwtPayload, req.body);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Appointments Created successfully!",
      data: result,
    });
  }
);

export const AppointmentController = {
  createAppointment,
};

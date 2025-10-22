import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { AppointmentService } from "./appoinment.service";

const createAppointment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await AppointmentService.createAppointment ( req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Appointments Created successfully!",
    data: result,
  });
});


export const AppointmentController = {
  createAppointment
}
import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { AppointmentService } from "./appoinment.service";
import { IJwtPayload } from "../../type/common";
import pick from "../../helper/pick";

const createAppointment = catchAsync(
  async (req: Request & { user?: IJwtPayload }, res: Response) => {
    const user = req.user;

    const result = await AppointmentService.createAppointment(
      user as IJwtPayload,
      req.body
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Appointments Created successfully!",
      data: result,
    });
  }
);

const getMyAppointment = catchAsync(
  async (req: Request & { user?: IJwtPayload }, res: Response) => {
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const filters = pick(req.query, ["status", "paymentStatus"]);
    const user = req.user;
    const result = await AppointmentService.getMyAppointment(
      user as IJwtPayload,
      filters,
      options
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Appointment fetched successfully!",
      data: result,
    });
  }
);

const updateAppointmentStatus = catchAsync(
  async (req: Request & { user?: IJwtPayload }, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const user = req.user;

    const result = await AppointmentService.updateAppointmentStatus(
      id,
      status,
      user as IJwtPayload
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Appointment updated successfully!",
      data: result,
    });
  }
);

export const AppointmentController = {
  createAppointment,
  getMyAppointment,
  updateAppointmentStatus,
};

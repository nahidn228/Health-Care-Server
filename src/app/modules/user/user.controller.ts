import httpStatus from "http-status";
import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { UserService } from "./user.service";
import sendResponse from "../../shared/sendResponse";
import { prisma } from "../../shared/prisma";
import pick from "../../helper/pick";
import { IJwtPayload } from "../../type/common";

const createPatient = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createPatient(req);
  console.log("from controller", result);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Patient created Successfully",
    data: result,
  });
});

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createAdmin(req);
  console.log("from controller", result);
  
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Admin Created successfully",
    data: result,
  });
});

const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createDoctor(req);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Doctor Created successfully!",
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ["status", "role", "email", "searchTerm"]);
  const options = pick(req.query, ["page", "limit", "sortOrder", "sortBy"]);

  // const { page, limit, searchTerm, sortOrder, sortBy, role, status } =
  //   req.query;

  // const result = await UserService.getAllFromDB({
  //   page: Number(page),
  //   limit: Number(limit),
  //   searchTerm,
  //   sortOrder,
  //   sortBy,
  // });
  const result = await UserService.getAllFromDB(filters, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User Retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});


const getMyProfile = catchAsync(async (req: Request & { user?: IJwtPayload }, res: Response) => {

    const user = req.user;

    const result = await UserService.getMyProfile(user as IJwtPayload);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "My profile data fetched!",
        data: result
    })
});

const changeProfileStatus = catchAsync(async (req: Request, res: Response) => {

    const { id } = req.params;
    const result = await UserService.changeProfileStatus(id, req.body)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Users profile status changed!",
        data: result
    })
});


export const UserController = {
  createPatient,
  createAdmin,
  createDoctor,
  getAllFromDB,
  getMyProfile,
  changeProfileStatus,
};

import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
  let success = false;
  let message = err.message || "Something went wrong!";
  let error = err;

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        message = "Duplicate email/username or key conflict";
        error = err.meta;
        statusCode = httpStatus.CONFLICT; // 409
        break;
      case "P1000":
        message = "Authentication failed";
        error = err.meta;
        statusCode = httpStatus.UNAUTHORIZED; // 401
        break;
      case "P1008":
        message = "Operation timed out";
        error = err.meta;
        statusCode = httpStatus.REQUEST_TIMEOUT; // 408
        break;
      case "P1001":
        message = "Database not reachable";
        error = err.meta;
        statusCode = httpStatus.SERVICE_UNAVAILABLE; // 503
        break;
      case "P2000":
        message = "Input exceeds field length";
        error = err.meta;
        statusCode = httpStatus.BAD_REQUEST; // 400
        break;
      case "P2005":
        message = "Invalid field value";
        error = err.meta;
        statusCode = httpStatus.BAD_REQUEST; // 400
        break;
      case "P2011":
        message = "Missing required field";
        error = err.meta;
        statusCode = httpStatus.BAD_REQUEST; // 400
        break;
      case "P2025":
        message = "Record not found";
        error = err.meta;
        statusCode = httpStatus.NOT_FOUND; // 404
        break;
      case "P2034":
        message = "Transaction failed";
        error = err.meta;
        statusCode = httpStatus.INTERNAL_SERVER_ERROR; // 500
        break;
      default:
        message = "Unknown database error";
        error = err.meta;
        statusCode = httpStatus.INTERNAL_SERVER_ERROR; // 500
        break;
    }
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = "Validation Error";
    error = err.message;
  } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    message =
      "Something went wrong while processing your request. Please try again later or contact support if the issue continues.";
    error = err.message;
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
  } else if (err instanceof Prisma.PrismaClientRustPanicError) {
    message =
      "A critical error occurred in the database engine. Please restart the server or try again later.";
    error = err.message;
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    message =
      "Database connection failed. Please check your database configuration.";
    error = err.message;
    statusCode = httpStatus.SERVICE_UNAVAILABLE;
  }

  res.status(statusCode).json({
    success,
    message,
    error,
  });
};

export default globalErrorHandler;

// if (err instanceof Prisma.PrismaClientKnownRequestError) {
//     if (err.code === "P2002") {
//       message = "Duplicate Key Error";
//       error = err.meta;
//     }
//     if (err.code === "P1000") {
//       message = "Authentication failed";
//       error = err.meta;
//     }
//     if (err.code === "P1008") {
//       message = "Operations timed out";
//       error = err.meta;
//     }
//     if (err.code === "P1001") {
//       message = "Database not reachable";
//       error = err.meta;
//     }
//     if (err.code === "P2000") {
//       message = "Input exceeds field length";
//       error = err.meta;
//     }
//     if (err.code === "P2002") {
//       message = "Duplicate email/username";
//       error = err.meta;
//     }
//     if (err.code === "P2005") {
//       message = "Invalid field value";
//       error = err.meta;
//     }
//     if (err.code === "P2011") {
//       message = "Missing required field";
//       error = err.meta;
//     }
//     if (err.code === "P2025") {
//       message = "Record not found";
//       error = err.meta;
//     }
//     if (err.code === "P2034") {
//       message = "Transaction failed";
//       error = err.meta;
//     }
//   }

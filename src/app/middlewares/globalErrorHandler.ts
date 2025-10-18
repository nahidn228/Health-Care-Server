import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = httpStatus.INTERNAL_SERVER_ERROR;
  let success = false;
  let message = err.message || "Something went wrong!";
  let error = err;

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      message = "Duplicate Key Error";
      error = err.meta;
    }
    if (err.code === "P1000") {
      message = "Authentication failed";
      error = err.meta;
    }
    if (err.code === "P1008") {
      message = "Operations timed out";
      error = err.meta;
    }
    if (err.code === "P1001") {
      message = "Database not reachable";
      error = err.meta;
    }
    if (err.code === "P2000") {
      message = "Input exceeds field length";
      error = err.meta;
    }
    if (err.code === "P2002") {
      message = "Duplicate email/username";
      error = err.meta;
    }
    if (err.code === "P2005") {
      message = "Invalid field value";
      error = err.meta;
    }
    if (err.code === "P2011") {
      message = "Missing required field";
      error = err.meta;
    }
    if (err.code === "P2025") {
      message = "Record not found";
      error = err.meta;
    }
    if (err.code === "P2034") {
      message = "Transaction failed";
      error = err.meta;
    }
  }

  res.status(statusCode).json({
    success,
    message,
    error,
  });
};

export default globalErrorHandler;

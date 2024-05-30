import { ErrorResponse } from '@/interfaces/ErrorResponse.js';
import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

class CustomAPIError extends Error {
  public statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (err: any, _req: Request, res: Response<ErrorResponse>, next: NextFunction) => {
  const defaultError: ErrorResponse['error'] & { statusCode: number } = {
    statusCode: err.statusCode || 500,
    name: err.name || 'Error',
    message: `${err.path ? `${err.path[0]}:` : ''} ${err.message}` || 'Something went wrong, try again later',
  };

  if (err instanceof CustomAPIError) {
    return res.status(defaultError.statusCode).json({
      success: false,
      message: 'Something went wrong',
      error: { name: defaultError.name, message: defaultError.message },
    });
  }

  if (err instanceof ZodError) {
    defaultError.name = 'ValidationError';
    defaultError.statusCode = 400;
    defaultError.message = Object.values(err.errors).map((issue) => {
      return `${issue.path[0]} : ${issue.message}`;
    });
  }

  if (err.name === 'CastError') {
    defaultError.name = err.name;
    defaultError.statusCode = 404;
    defaultError.message = `Resource "${err.value}" not found. Invalid: ${err.path}`;
  }

  if (err.code && err.code === 11000) {
    defaultError.name = err.name;
    defaultError.statusCode = 400;
    defaultError.message = `${Object.keys(err.keyValue)} field has to be unique`;
  }

  return res.status(defaultError.statusCode).json({
    success: false,
    message: 'Something went wrong',
    error: { name: defaultError.name, message: defaultError.message },
  });
};

export { errorHandler, CustomAPIError };

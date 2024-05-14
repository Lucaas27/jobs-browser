import { logger } from '@/services/logger.service';
import { NextFunction, Request, Response } from 'express';
import { CastError } from 'mongoose';

class CustomAPIError extends Error {
  public statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error({ err });

  let defaultError: { name: string; statusCode: number; message: string } = {
    name: err.name || 'Error',
    statusCode: err.statusCode || 500,
    message: err.message || 'Something went wrong, try again later',
  };

  if (err instanceof CustomAPIError) {
    return res.status(defaultError.statusCode).json({ success: false, message: { name: defaultError.name, message: defaultError.message } });
  }

  if (err.name === 'CastError') {
    defaultError.name = err.name;
    defaultError.statusCode = 404;
    defaultError.message = `Resource "${err.value}" not found. Invalid: ${err.path}`;
  }

  if (err.name === 'ValidationError') {
    defaultError.name = err.name;
    defaultError.statusCode = 400;
    defaultError.message = Object.values(err.errors)
      .map((val) => (val as any).message)
      .join(', ');
  }

  if (err.code && err.code === 11000) {
    defaultError.name = err.name;
    defaultError.statusCode = 400;
    defaultError.message = `${Object.keys(err.keyValue)} field has to be unique`;
  }

  return res.status(defaultError.statusCode).json({ success: false, error: { name: defaultError.name, message: defaultError.message } });
};

export { errorHandler, CustomAPIError };

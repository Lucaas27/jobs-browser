import { ErrorResponse } from '@/interfaces/ErrorResponse.js';
import { CustomAPIError } from '@/middlewares/errorHandler.middleware.js';
import { NextFunction, Request, Response } from 'express';

const notFound = (req: Request, res: Response<ErrorResponse>, next: NextFunction) => {
  return next(
    new CustomAPIError('The requested resource could not be found. Please check the URL and try again.', 404),
  );
};

export default notFound;

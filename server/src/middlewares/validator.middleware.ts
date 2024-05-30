import { RequestValidators } from '@/interfaces/RequestValidators.js';
import { NextFunction, Request, Response } from 'express';
import { ParsedQs } from 'qs';
import { ParamsDictionary } from 'express-serve-static-core';

const validateRequest = (validators: RequestValidators) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (validators.body) {
      req.body = await validators.body.parseAsync(req.body);
    }
    if (validators.params) {
      req.params = (await validators.params.parseAsync(req.params)) as ParamsDictionary;
    }
    if (validators.query) {
      req.query = (await validators.query.parseAsync(req.query)) as ParsedQs;
    }
    next();
  };
};

export default validateRequest;

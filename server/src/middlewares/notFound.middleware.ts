import { Request, Response } from 'express';
const notFound = (req: Request, res: Response) => {
  return res.status(404).json({ success: false, error: { name: 'Error', message: 'Endpoint not found' } });
};

export { notFound };

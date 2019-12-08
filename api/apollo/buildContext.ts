import { Request, Response } from "express";

export const buildContext = ({ req, res }: { req: Request; res: Response }) => {
  return {
    req,
    res,
  };
};

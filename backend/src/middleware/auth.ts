import { Request, Response, NextFunction } from "express";

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  // console.log(req);
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ msg: "Unauthorised" });
};

module.exports = isAuthenticated;

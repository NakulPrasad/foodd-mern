import express from "express";
import { getLocation, homeTest } from "../controllers/home.controller.js";
import authenticateToken from "../middleware/jwtAuth.js";

export const homeRouter = express.Router();
// homeRouter.use(authenticateToken);
homeRouter.get("/test", homeTest);
homeRouter.get('/getLocation', getLocation);

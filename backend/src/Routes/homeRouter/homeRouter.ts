import express from "express";
import { getLocation, homeTest } from "../../controllers/homeRouterController/homeRouterController.js";
import authenticateToken from "../../middleware/authMiddleware.js";

export const homeRouter = express.Router();
// homeRouter.use(authenticateToken);
homeRouter.get("/test", homeTest);
homeRouter.get('/getLocation', getLocation);

import express from "express"
import { getFoodData, getFoodDetails, homeTest } from "../../controllers/homeRouterController/homeRouterController.js"

export const homeRouter = express.Router()

homeRouter.get("/test", homeTest)
homeRouter.get("/getFoodData", getFoodData)

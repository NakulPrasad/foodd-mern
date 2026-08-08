import { Request, Response } from "express";

export const homeTest = (req: Request, res: Response) => {
  return res.status(200).json({ message: "Working home route" });
};

export const getLocation = async (req: Request, res: Response) => {
  const { latitude, longitude } = req.query;
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "FoodDeliveryClient/1.0 (https://github.com/NakulPrasad/foodd-mern)",
    },
  });
  const data = await response.json();
  // res.json(data);
  // console.log(res);
  return res.status(200).json(data);
};

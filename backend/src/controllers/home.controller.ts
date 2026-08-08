import { Request, Response } from "express";

export const homeTest = (req: Request, res: Response) => {
  return res.status(200).json({ message: "Working home route" });
};

export const getLocation = async (req: Request, res: Response) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: "Latitude and longitude are required parameters" });
    }

    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "FoodDeliveryClient/1.0 (https://github.com/NakulPrasad/foodd-mern)",
      },
    });

    if (!response.ok) {
      return res.status(500).json({ message: "Failed to query geocoding provider" });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error in getLocation reverse geocoding:", error);
    return res.status(500).json({ message: "Error fetching location address data" });
  }
};

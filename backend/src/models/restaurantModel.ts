import mongoose, { Document, Model, Schema } from "mongoose";

interface IRestaurant extends Document {
  name: string;
  description: string;
  location: ILocation;
  createdAt: Date;
  updatedAt: Date;
}

interface ILocation extends Document {
  address: string;
  city: string;
  state: string;
  postalCode: string;
}

const LocationSchema: Schema = new Schema<ILocation>({
  address: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type: String,
    required: true,
    trim: true,
  },
  postalCode: {
    type: String,
    required: true,
    trim: true,
  },
});

const RestaurantSchema: Schema<IRestaurant> = new Schema<IRestaurant>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    location: {
      type: LocationSchema,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const RestaurantModel: Model<IRestaurant> = mongoose.model<IRestaurant>(
  "IRestaurant",
  RestaurantSchema,
);

export { IRestaurant, RestaurantModel };

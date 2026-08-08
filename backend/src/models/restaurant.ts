import { Document, model, Schema, Types } from "mongoose";


export interface IRestaurant extends Document {
  name: string;
  ownerName: string;
  description: string;
  cuisine: string[];
  location: ILocation;
  createdAt: Date;
  updatedAt: Date;
  image: string;
  isVeg: boolean;
  priceRange: string;
  deliveryTime: string;
  contact: {
    phone: string;
    email: string;
  };
  rating: number;
  timing: {
    open: number;
    close: number;
  };
  menu: [Types.ObjectId];
}

export interface ILocation {
  address: string;
  city: string;
  state: string;
  area: string;
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
  area: {
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
    ownerName: String,
    description: {
      type: String,
      trim: true,
    },
    cuisine: {
      type: [String],
      required: true,
    },
    location: {
      type: LocationSchema,
      required: true,
    },
    rating: {
      type: Number,
    },
    image: {
      type: String,
    },
    isVeg: {
      type: Boolean,
    },
    priceRange: {
      type: String,
    },
    deliveryTime: {
      type: String,
    },
    contact: {
      type: {
        phone: String,
        email: String,
      },
      required: true,
    },
    timing: {
      type: {
        open: Number,
        close: Number,
      },
      required: true,
    },
    menu: [{type: Types.ObjectId, ref:"foodItems" }],
  },
  {
    timestamps: true,
  },
);

// export const RestaurantModel: Model<IRestaurant> = mongoose.model<IRestaurant>(
//   "IRestaurant",
//   RestaurantSchema,
// );

// export { IRestaurant, RestaurantModel };


export default model<IRestaurant>("restaurant", RestaurantSchema);

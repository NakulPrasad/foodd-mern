import { Schema, Types, model } from "mongoose";

const UserSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  location: {
    type: String,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  avatarUrl: {
    type: String,
    require: false,
  },
});

export interface userInterface {
  id: Types.ObjectId;
  name: string;
  location?: string;
  email: string;
  password: string;
  date?: Date;
  avatarUrl?: String;
}

export interface userInterfaceOAuth {
  name: string;
  location?: string;
  email: string;
  password?: string;
  date?: Date;
  avatarUrl?: String;
}
export default model("user", UserSchema);

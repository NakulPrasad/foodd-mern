import mongoose from "mongoose";

class dbConfig {
  private static isConnected = false;

  private static instance: dbConfig;
  private static mongodb_connection_uri = process.env.MONGODB_CONNECTION_URI;

  public static getConnectionStatus(){
    return this.isConnected;
  }

  public static getInstance(): dbConfig {
    if (!dbConfig) {
      this.instance = new dbConfig();
    }
    return dbConfig.instance;
  }

  public async connect(): Promise<void> {
    mongoose.set("strictQuery", true);
    const MONGODB_URI = dbConfig.mongodb_connection_uri;

    try {
      if (!MONGODB_URI) {
        throw new Error("MongoDB URL is invalid");
      }
      await mongoose.connect(MONGODB_URI);
      dbConfig.isConnected = true;
      console.log("MONGODB connected");
    } catch (error) {
      console.error("Error connecting to MongoDB: ", error);
    }
  }
}

export default dbConfig;

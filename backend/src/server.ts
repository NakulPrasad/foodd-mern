import app from "./index.js";
import dbConfig from "./configs/dbConfig2.js";

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    const db = new dbConfig();
    await db.connect();
    app.listen(PORT, () => {
      console.log(`NODE Server is running at ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

start();

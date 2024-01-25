import mongoose from "mongoose";

const URI = "mongodb://127.0.0.1:27017";

const db = async () => {
  try {
    const con = await mongoose.connect(URI);
    console.info(`mongodb connected: ${con.connection.host}`);
  } catch (error) {
    console.error(error);
  }
}

export default db;
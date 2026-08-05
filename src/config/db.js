const mongoose = require("mongoose");
const config = require("./env");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri, {
      family: 4,
      serverSelectionTimeoutMS: 10000,
    });

    console.log(
      `[Database] MongoDB Connected: ${conn.connection.host} / ${conn.connection.name}`
    );
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = connectDB;
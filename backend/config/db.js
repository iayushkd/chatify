const mongoose = require('mongoose');

const connectDB = async() => {
  try {
    const conn = await mongoose.connect("mongodb+srv://suvankarchowdhury:yQn20Er6MHk7jJXb@cluster1.02vvc5c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1");
    console.log(`MongoDB connected: ${conn.connection.host}`);
  }
  catch(error) {
    console.log(`Error: ${error.message}`);
    process.exit();
  }
}
module.exports = connectDB;
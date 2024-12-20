import mongoose from "mongoose";

// Create the main user schema
const Developerschema = new mongoose.Schema({
    PostedUser: {
      type: String,
     
    },
    Complaient: {
      type: String,
      required: [true, "Please provide the Complaient"],
    },
    date: {
      type: Date,
    },
  });
  
  // Export the Developerschema as a Mongoose model
  export default mongoose.model("DEVELOPERSCHEMA", Developerschema);
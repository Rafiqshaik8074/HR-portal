import mongoose from 'mongoose';
import AutoIncrementFactory from 'mongoose-sequence';

// Initialize the AutoIncrement plugin with the mongoose instance
const AutoIncrement = AutoIncrementFactory(mongoose);

const clientSchema = new mongoose.Schema({
  Req_id: {
    type: Number,
    unique: true,
  },
  Clientname: {
    type: String,
    trim: true,
    required: [true, "Client name is required."],
  },
  Address: {
    type: String,
    required: [true, "Please provide the Address"],
    trim: true,
    unique: true,
  },
  Email: {
    type: String,
    required: [true, "Please provide the Email"],
    trim: true,
    lowercase: true,
    validate: {
      validator: (v) => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v),
      message: "Invalid email address.",
    },
  },
  MobileNumber: {
    type: String,
    required: [true, "Please provide the Mobile Number"],
    trim: true,
    validate: {
      validator: (v) => /^(\+91)?\s*\d{10}$/.test(v),
      message: "Invalid mobile number. Please enter a 10-digit number with optional +91 country code and without spaces.",
    },
  },
  HrEmail: {
    type: String,
    required: [true, "Please provide the HR Email"],
    trim: true,
    lowercase: true,
    validate: {
      validator: (v) => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v),
      message: "Invalid HR email address.",
    },
  },
  HrMobileNumber: {
    type: String,
    required: [true, "Please provide the HR Mobile Number"],
    trim: true,
    validate: {
      validator: (v) => /^(\+91)?\s*\d{10}$/.test(v),
      message: "Invalid HR mobile number. Please enter a 10-digit number with optional +91 country code and without spaces.",
    },
  }
}, {
  timestamps: true // This will add createdAt and updatedAt fields
});

clientSchema.plugin(AutoIncrement, { inc_field: 'Req_id' });

export default mongoose.model("Client", clientSchema);
import mongoose from 'mongoose';
 
async function connect() {
  try {
    await mongoose.connect(process.env.MONGO_URL, { 
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Database connected');
  } catch (error) {
    console.error('Failed to connect to the MongoDB server:', error);
  }
}
 
export default connect; 
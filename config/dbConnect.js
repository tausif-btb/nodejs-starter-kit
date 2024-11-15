import mongoose from 'mongoose';

const connectDB = async (DB) => {
    try 
    {
      await mongoose.connect(DB, {
      });
      console.log('DB connected Successfully');
    } 
    catch (err) {
      console.error('Database connection failed:', err);
      process.exit(1);
    }
};

export default connectDB;

import mongoose from 'mongoose';

const { Schema, models } = mongoose;

const ingredientSchema = new mongoose.Schema({
    ingredientName: String,
    expDate: String,
    quantity: Number,
    units: String
  }, { _id: false });

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    ingredients: [ingredientSchema],
    allergies: [String]
  },
  { timestamps: true }
);

const User = models.User || mongoose.model('User', userSchema);
export default User;
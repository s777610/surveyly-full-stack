const mongoose = require("mongoose");
const { Schema } = mongoose; // they are same, const Schema = mongoose.Schema;

const userSchema = new Schema({
  googleId: String,
  credits: { type: Number, default: 0 }
});

// tell mongo that we want to create 'users' collection using that userSchema
// load this schema into mongoose
mongoose.model("users", userSchema);

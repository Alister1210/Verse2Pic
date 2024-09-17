import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  prompt: { type: String, required: true },
  image: { type: String, required: true }, // Base64 image data
});

const Image = mongoose.model("Image", imageSchema);
export default Image;

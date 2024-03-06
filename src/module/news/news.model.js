import mongoose from "../../config/mongo.js";
const { Schema } = mongoose;

const newsSchema = new Schema(
  {
    id: String,
    title: String,
    image: String,
    text: String,
    category: String,
  },
  {
    timestamps: true,
  }
);

const NewsModel = mongoose.model("News", newsSchema);

export default NewsModel;

import mongoose from "mongoose";
import { type } from "os";

const credentialsSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  shop: {
    type: String,
    required: true,
  },
  apiKey: {
    type: String,
    required: true,
  },
  apiSecret: {
    type: String,
    required: true,
  },
});

const credentials =
  mongoose.models.credentials ||
  mongoose.model("credentials", credentialsSchema);

export default credentials;

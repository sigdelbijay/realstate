import { model, Schema, ObjectId } from "mongoose";

const schema = new Schema(
  {
    photos: [{}],
    price: {
      type: Number,
      maxLength: 255,
    },
    address: {
      type: String,
      required: true,
      maxLength: 255,
    },
    bedrooms: Number,
    bathrooms: Number,
    landsize: Number,
    carpark: Number,
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: {
        type: [Number],
        default: [144.963058, -37.813629] //longitude, latitude
      }
    },
    title: {
      type: String,
      maxLength: 255,
    },
    slug: {
      type: String,
      lowercase: true,
      unique: true
    },
    description: {},
    postedBy: {
      type: ObjectId,
      ref: 'User',
    },
    sold: {
      type: Boolean,
      default: false
    },
    googleMap: {},
    type: {
      type: String,
      default: "Other"
    },
    action: {
      type: String,
      default: "Sell"
    },
    views: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);
schema.index({location: '2dsphere'});
export default model("Ad", schema);
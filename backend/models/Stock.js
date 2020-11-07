import mongoose from "mongoose";

// const mongoose = require("mongoose");
const { Schema } = mongoose;

const stockSchema = new Schema({
  koreaStocks: {
    type: Object,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

const Stock = mongoose.model("Stock", stockSchema);


export default Stock;
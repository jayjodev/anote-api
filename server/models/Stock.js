const mongoose = require("mongoose");
const { Schema } = mongoose;

const stockSchema = new Schema({
  result: {
    type: String,
    required: true,
  },
});

const Stock = mongoose.model("Stock", stockSchema);

module.exports = Stock;
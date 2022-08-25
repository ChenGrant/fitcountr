const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  userUID: {
    type: String,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  nutrients: {
    type: {},
    required: true,
    validate: {
      validator: function () {
        // validate that keys is in a set of nutrient names
        // validate that the value is a measurement object
        return true;
      },
    },
  },

  servingSize: {
    type: {},
    required: true,
    validate: {
      validator: function () {
        // validate that this value is a measurement object
        return true;
      },
    },
  },

  searchMethod: {
    type: String,
    required: true,
    validate: {
      validator: function () {
        // validate that the value is included in ['BARCODE_SEARCH_METHOD', 'FOOD_NAME_SEARCH_METHOD']
        return true;
      },
    },
  },

  barcodeNumber: String,
});

module.exports = mongoose.model("Food", foodSchema);

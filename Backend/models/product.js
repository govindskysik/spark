const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProductSchema = new Schema({
  _id:{
    type:Number,
    required:true,
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  final_price: {
    type: Number,
    required: true,
    default: 0.0
  },
  specifications: {
    type: [{ name: String, value: String }],
    default: []
  },
  image_urls: {
    type: [String],
    default: []
  },
  top_reviews: {
    type: Schema.Types.Mixed, // Object
    default: { negative: {}, positive: {} }
  },
  rating_stars: {
    type: Schema.Types.Mixed, // Object
    default: { five_stars: 0, four_stars: 0, three_stars: 0, two_stars: 0, one_star: 0 }
  },
  available_for_delivery: {
    type: Boolean,
    default: false
  },
  available_for_pickup: {
    type: Boolean,
    default: false
  },
  brand: {
    type: String,
    trim: true,
    default: 'Generic'
  },
  breadcrumbs: {
    type: [{ name: String, url: String }],
    default: []
  },
  description: {
    type: String,
    trim: true,
    default: 'No description available'
  },
  product_name: {
    type: String,
    required: true,
    trim: true
  },
  review_tags: {
    type: [String],
    default: []
  },
  root_category_name: {
    type: String,
    trim: true,
    default: 'Uncategorized'
  },
  tags: {
    type: [String],
    default: []
  },
  rating: {
    type: Number,
    default: 0
  },
  aisle: {
    type: String,
    trim: true,
    default: ''
  },
  free_returns: {
    type: String,
    trim: true,
    default: ''
  },
  sizes: {
    type: [String],
    default: []
  },
  colors: {
    type: [String],
    default: []
  },
  other_attributes: {
    type: [{ name: String, value: String }],
    default: []
  },
  customer_reviews: {
    type: [Schema.Types.Mixed], // Array of objects
    default: []
  },
  initial_price: {
    type: Number,
    default: 0.0
  },
  discount: {
    type: Number,
    default: 0.0
  },
  ingredients_full: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', ProductSchema);

const csv = require('csvtojson');
const mongoose = require('mongoose');
const Product = require('./models/product');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.error('Connection error:', err));

const addQuantity = async () => {
  try {
    const products = await Product.find().select('_id');
    const bulkData = products.map(product => ({
      updateOne: {
        filter: { _id: product._id },
        update: { $set: { quantity: Math.floor(Math.random() * 21) } } // Use $set for safety
      }
    }));

    await Product.bulkWrite(bulkData);
    console.log(`Products updated with quantity`);
  } catch (error) {
    console.error('Error updating products:', error);
  } finally {
    mongoose.connection.close();
    // Optionally: process.exit(0);
  }
};

addQuantity();

const csv = require('csvtojson');
const mongoose = require('mongoose');
const Product = require('./models/product'); // Adjust path if needed
require('dotenv').config();

// MongoDB Atlas connection string from environment variable
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.error('Connection error:', err));

const importData = async (filePath) => {
  try {
    // Clear existing data (optional, remove if you don't want to delete existing products)
    await Product.deleteMany({});
    console.log('Existing data cleared');

    // Convert CSV to JSON
    const jsonArray = await csv().fromFile(filePath);
    console.log(`Loaded ${jsonArray.length} products from CSV`);

    // Track errors and successful imports
    let successCount = 0;
    let errorCount = 0;
    const errorLog = [];

    // Transform data to match your schema with error tracking
    const transformedData = jsonArray.map((product, rowIndex) => {
      const rowErrors = [];

      // Helper function to parse JSON fields with error handling
      const parseJsonField = (field, fieldName, defaultValue) => {
        if (field && typeof field === 'string') {
          try {
            // Replace single quotes with double quotes for valid JSON
            return JSON.parse(field.replace(/'/g, '"'));
          } catch (e) {
            rowErrors.push(`Column '${fieldName}': Failed to parse JSON - ${e.message}`);
            return defaultValue;
          }
        }
        return field || defaultValue;
      };

      // Helper function to parse numeric fields with error handling
      const parseNumericField = (field, fieldName, defaultValue) => {
        const value = parseFloat(field);
        if (isNaN(value)) {
          rowErrors.push(`Column '${fieldName}': Invalid number, defaulting to ${defaultValue}`);
          return defaultValue;
        }
        return value;
      };

      // Helper function to parse boolean fields with error handling
      const parseBooleanField = (field, fieldName, defaultValue) => {
        if (typeof field === 'string') {
          const normalized = field.toUpperCase();
          if (normalized === 'TRUE' || normalized === '1') return true;
          if (normalized === 'FALSE' || normalized === '0') return false;
        }
        if (typeof field === 'boolean') return field;
        rowErrors.push(`Column '${fieldName}': Unrecognized boolean value, defaulting to ${defaultValue}`);
        return defaultValue;
      };

      // Transform the row data
      const transformedProduct = {
        url: product.url || '',
        final_price: parseNumericField(product.final_price, 'final_price', 0.0),
        specifications: parseJsonField(product.specifications, 'specifications', []),
        image_urls: parseJsonField(product.image_urls, 'image_urls', []),
        top_reviews: parseJsonField(product.top_reviews, 'top_reviews', { negative: {}, positive: {} }),
        rating_stars: parseJsonField(product.rating_stars, 'rating_stars', { five_stars: 0, four_stars: 0, three_stars: 0, two_stars: 0, one_star: 0 }),
        available_for_delivery: parseBooleanField(product.available_for_delivery, 'available_for_delivery', false),
        available_for_pickup: parseBooleanField(product.available_for_pickup, 'available_for_pickup', false),
        brand: product.brand || 'Generic',
        description: product.description || 'No description available',
        product_name: product.product_name || 'Unknown Product',
        root_category_name: product.root_category_name || 'Uncategorized',
        breadcrumbs: parseJsonField(product.breadcrumbs, 'breadcrumbs', []),
        tags: parseJsonField(product.tags, 'tags', []),
        rating: parseNumericField(product.rating, 'rating', 0.0),
        aisle: product.aisle || '',
        free_returns: product.free_returns || '',
        sizes: parseJsonField(product.sizes, 'sizes', []),
        colors: parseJsonField(product.colors, 'colors', []),
        other_attributes: parseJsonField(product.other_attributes, 'other_attributes', []),
        customer_reviews: parseJsonField(product.customer_reviews, 'customer_reviews', []),
        initial_price: parseNumericField(product.initial_price, 'initial_price', 0.0),
        discount: parseNumericField(product.discount, 'discount', 0.0),
        ingredients_full: parseJsonField(product.ingredients_full, 'ingredients_full', [])
      };

      // Log errors for this row if any
      if (rowErrors.length > 0) {
        errorCount++;
        errorLog.push({
          row: rowIndex + 1, // Adding 1 since rows are typically 1-indexed in CSV
          errors: rowErrors
        });
      } else {
        successCount++;
      }

      return transformedProduct;
    });

    // Bulk insert into MongoDB with error handling for individual document failures
    const result = await Product.insertMany(transformedData, { ordered: false });
    console.log(`Successfully imported ${result.length} products out of ${jsonArray.length} rows`);
    console.log(`Successful rows: ${successCount}`);
    console.log(`Rows with errors: ${errorCount}`);

    // Log detailed errors if any
    if (errorLog.length > 0) {
      console.log('\nDetailed Error Log:');
      errorLog.forEach(log => {
        console.log(`Row ${log.row}:`);
        log.errors.forEach(error => console.log(`  - ${error}`));
      });
    } else {
      console.log('No errors encountered during data transformation.');
    }

    // Close connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Import error:', error.message);
    mongoose.connection.close();
  }
};

// Run the import with the path to your CSV file
importData('./data/cleaned_dataset_corrected.csv'); // Adjust path if needed

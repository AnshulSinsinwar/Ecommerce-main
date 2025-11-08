import mongoose from 'mongoose';
import dotenv from 'dotenv';
import https from 'https';
import Product from './models/Product.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const API_URL = "https://fakestoreapi.com/products";

if (!MONGO_URI) {
  console.error('MISSING MONGO_URI in backend/.env');
  process.exit(1);
}

// Fetch products from Fake Store API
function fetchProducts() {
  return new Promise((resolve, reject) => {
    https.get(API_URL, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const products = JSON.parse(data);
          resolve(products);
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function run() {
  try {
    await mongoose.connect(MONGO_URI, { dbName: 'vibe_commerce' });
    console.log('Connected to MongoDB');

    const count = await Product.countDocuments();
    if (count > 0) {
      console.log(`Products already exist (${count}). Skipping insert.`);
    } else {
      console.log('Fetching products from Fake Store API...');
      const apiProducts = await fetchProducts();
      
      // Transform API products to match our schema
      const products = apiProducts.map(p => ({
        title: p.title,
        price: p.price,
        description: p.description,
        category: p.category,
        image: p.image
      }));
      
      await Product.insertMany(products);
      console.log(`Inserted ${products.length} products from API.`);
    }
  } catch (err) {
    console.error('Seed error:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected');
  }
}

run();

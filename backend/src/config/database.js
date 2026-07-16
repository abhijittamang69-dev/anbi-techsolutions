const mongoose = require('mongoose');

let isConnected = false;

const isDBConnected = () => isConnected;

const getMongoURI = () => {
  let uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI environment variable is not set!');
    return null;
  }
  // If URI has no database name (ends with .mongodb.net/ or .mongodb.net/?), add default
  if (uri.includes('.mongodb.net/') && !uri.match(/\.mongodb\.net\/[^/\?]/)) {
    uri = uri.replace('.mongodb.net/', '.mongodb.net/anbi_tech_db');
  }
  return uri;
};

const connectDB = async (retries = 5, delay = 2000) => {
  const uri = getMongoURI();
  if (!uri) return;

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    isConnected = true;
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected. Attempting to reconnect...');
      isConnected = false;
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected.');
      isConnected = true;
    });

    mongoose.connection.on('error', (err) => {
      console.error(`❌ MongoDB connection error: ${err.message}`);
    });

  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    if (error.message.includes('IP')) {
      console.error('   👉 Go to MongoDB Atlas → Network Access → Add IP Address → Allow from anywhere (0.0.0.0/0)');
    }
    if (error.message.includes('authentication')) {
      console.error('   👉 Check your MongoDB username and password in the connection string.');
    }
    if (error.message.includes('ENOTFOUND')) {
      console.error('   👉 Check your MongoDB cluster name in the connection string.');
    }

    if (retries > 0) {
      console.log(`🔄 Retrying connection in ${delay}ms... (${retries} attempts left)`);
      setTimeout(() => connectDB(retries - 1, delay * 2), delay);
    } else {
      console.error('❌ Max MongoDB connection retries exhausted.');
      if (process.env.NODE_ENV === 'production') {
        console.error('   Exiting process (production mode).');
        process.exit(1);
      } else {
        console.warn('   Server will continue running without database (development mode).');
      }
    }
  }
};

module.exports = { connectDB, isDBConnected, getMongoURI };

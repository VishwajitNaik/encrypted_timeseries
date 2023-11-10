const io = require('socket.io')();
const crypto = require('crypto');
const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017'; // Replace with your MongoDB URL
const dbName = 'timeseries_db'; // Replace with your database name

io.on('connection', (socket) => {
  console.log('Listener Service connected to Emitter Service');

  // Handle incoming encrypted data stream
  socket.on('encryptedData', async (data) => {
    for (const message of data) {
      const decryptedMessage = decrypt(message.encryptedMessage, 'your_secret_key_here');

      if (validateIntegrity(message, decryptedMessage)) {
        // If data integrity is valid, add a timestamp and save to MongoDB
        message.timestamp = new Date();
        await saveToMongoDB(message);
        console.log('Saved to MongoDB:', message);
      } else {
        console.log('Data integrity compromised, discarding operation:', message);
      }
    }
  });
});

io.listen(3000); // Replace with the port you want to listen on

// Function to decrypt using aes-256-ctr
function decrypt(encrypted, secret) {
  const decipher = crypto.createDecipher('aes-256-ctr', secret);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// Function to validate data integrity
function validateIntegrity(originalMessage, decryptedMessage) {
  const expectedSecretKey = crypto.createHash('sha256').update(JSON.stringify(originalMessage)).digest('hex');
  return expectedSecretKey === decryptedMessage.secret_key;
}

// Function to save data to MongoDB
async function saveToMongoDB(data) {
  const client = new MongoClient(url, { useUnifiedTopology: true });
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('timeseries_data');
    await collection.insertOne(data);
  } catch (err) {
    console.error('Error saving data to MongoDB:', err);
  } finally {
    await client.close();
  }
}

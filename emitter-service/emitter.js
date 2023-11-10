const fs = require('fs');
const crypto = require('crypto');
const io = require('socket.io-client');

// Load the constant values from data.json
const data = require('./data.json');

// Function to create a SHA-256 hash
function createHash(data) {
  const hash = crypto.createHash('sha256');
  hash.update(JSON.stringify(data));
  return hash.digest('hex');
}

// Function to encrypt using aes-256-ctr
function encrypt(text, secret) {
  const cipher = crypto.createCipher('aes-256-ctr', secret);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// Function to send the encrypted message
function sendEncryptedMessage(socket) {
  const messages = [];

  // Generate and encrypt messages
  for (let i = 0; i < Math.floor(Math.random() * 450) + 50; i++) {
    const message = {
      name: data.names[Math.floor(Math.random() * data.names.length)],
      origin: data.origins[Math.floor(Math.random() * data.origins.length)],
      destination: data.destinations[Math.floor(Math.random() * data.destinations.length)],
    };
    message.secret_key = createHash(message);
    message.encryptedMessage = encrypt(JSON.stringify(message), 'your_secret_key_here');
    messages.push(message);
  }

  // Emit the encrypted messages to the Listener Service
  socket.emit('encryptedData', messages);

  // Schedule the next emission after 10 seconds
  setTimeout(() => sendEncryptedMessage(socket), 10000);
}

// Connect to the Listener Service
const socket = io('http://localhost:3000'); // Change the URL as needed

socket.on('connect', () => {
  console.log('Emitter Service connected to Listener Service');
  sendEncryptedMessage(socket);
});

socket.on('disconnect', () => {
  console.log('Emitter Service disconnected from Listener Service');
});

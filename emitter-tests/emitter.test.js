const { expect } = require('chai');
const { createHash, encrypt } = require('../emitter'); // Import relevant functions from your emitter script

describe('Emitter Service', () => {
  it('should create a valid SHA-256 hash', () => {
    const data = { name: 'John Doe', origin: 'Bengaluru', destination: 'Mumbai' };
    const hash = createHash(data);

    expect(hash).to.be.a('string');
    // Add more specific assertions to test the hash function
  });

  it('should encrypt data', () => {
    const data = 'Some data to encrypt';
    const secret = 'your_secret_key_here'; // Replace with your actual secret key
    const encryptedData = encrypt(data, secret);

    expect(encryptedData).to.be.a('string');
    // Add more specific assertions to test the encryption function
  });

  // Add more test cases for other functions and edge cases
});

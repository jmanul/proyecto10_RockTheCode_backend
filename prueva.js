const crypto = require('crypto');

// Generar una clave criptográfica aleatoria de 32 bytes (256 bits)
const generateCryptoKey = () => {
     const keyBuffer = crypto.randomBytes(32); // Genera 32 bytes aleatorios
     const keyBase64 = keyBuffer.toString('base64'); // Convierte el buffer a Base64
     return keyBase64;
};

// Ejecutar la función y mostrar la clave generada
const cryptoKey = generateCryptoKey();
console.log("CRYPTO_KEY (Base64):", cryptoKey);
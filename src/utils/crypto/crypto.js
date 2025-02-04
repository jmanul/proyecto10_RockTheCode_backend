

const crypto = require('crypto');

const encrypt = (text) => {

     if (!process.env.CRYPTO_KEY) {
          throw new Error("CRYPTO_KEY no está definido.");
     }

     // Asegurar clave de 16 bytes para AES-128
     const key = Buffer.alloc(16);
     Buffer.from(process.env.CRYPTO_KEY, 'utf-8').copy(key);

     const iv = crypto.randomBytes(16);
     const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);

     let encrypted = cipher.update(text, 'utf8', 'hex');
     encrypted += cipher.final('hex');

     return Buffer.from(iv.toString('hex') + encrypted, 'hex').toString('base64');
 
    
};

const decrypt = (encryptedText) => {
   
         if (!process.env.CRYPTO_KEY) {
        throw new Error("CRYPTO_KEY no está definido.");
    }

    // Asegurar clave de 16 bytes para AES-128
    const key = Buffer.alloc(16);
    Buffer.from(process.env.CRYPTO_KEY, 'utf-8').copy(key);

    // Convertir Base64 a Buffer y extraer IV + texto cifrado
    const encryptedBuffer = Buffer.from(encryptedText, 'base64');
    const iv = Buffer.from(encryptedBuffer.subarray(0, 32).toString(), 'hex');
    const encrypted = encryptedBuffer.subarray(32).toString('hex');

    const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
};

module.exports = { encrypt, decrypt };
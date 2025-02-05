

const crypto = require('crypto');


const encrypt = (text) => {
     try {
          // Validar que el texto no esté vacío
          if (!text || typeof text !== "string") {
               throw new Error("El texto a encriptar debe ser una cadena no vacía.");
          }

          // Validar que CRYPTO_KEY esté definida y sea correcta
          if (!process.env.CRYPTO_KEY || process.env.CRYPTO_KEY.length !== 64) {
               throw new Error("CRYPTO_KEY debe ser una cadena hexadecimal de 64 caracteres (32 bytes).");
          }

          // Convertir la clave a Buffer
          const key = Buffer.from(process.env.CRYPTO_KEY, "hex");
          if (key.length !== 32) {
               throw new Error("CRYPTO_KEY debe representar 32 bytes.");
          }

          // Generar un IV (Vector de Inicialización) aleatorio (16 bytes)
          const iv = crypto.randomBytes(16);

          // Crear el cifrador
          const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

          // Cifrar el texto en Base64
          let encrypted = cipher.update(text, "utf8", "base64");
          encrypted += cipher.final("base64");

          // Devolver el IV + texto cifrado, ambos codificados en Base64
          return `${iv.toString("base64")}:${encrypted}`;
     } catch (error) {
          console.error("Error en encrypt:", error.message);
          throw error; // Propaga el error para manejarlo en el modelo
     }
};

const decrypt = (encryptedText) => {
     try {
          // Validar que el texto cifrado no esté vacío
          if (!encryptedText || typeof encryptedText !== "string") {
               throw new Error("El texto cifrado debe ser una cadena no vacía.");
          }

          // Separar el IV del texto cifrado
          const parts = encryptedText.split(":");
          if (parts.length !== 2) {
               throw new Error("El texto cifrado no tiene el formato correcto (IV:encryptedText).");
          }

          const iv = Buffer.from(parts[0], "base64"); // Decodificar el IV desde Base64
          const encrypted = Buffer.from(parts[1], "base64"); // Decodificar el texto cifrado desde Base64

          // Validar que CRYPTO_KEY esté definida y sea correcta
          if (!process.env.CRYPTO_KEY || process.env.CRYPTO_KEY.length !== 64) {
               throw new Error("CRYPTO_KEY debe ser una cadena hexadecimal de 64 caracteres (32 bytes).");
          }

          // Convertir la clave a Buffer
          const key = Buffer.from(process.env.CRYPTO_KEY, "hex");
          if (key.length !== 32) {
               throw new Error("CRYPTO_KEY debe representar 32 bytes.");
          }

          // Crear el descifrador
          const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);

          // Descifrar el texto
          let decrypted = decipher.update(encrypted, "base64", "utf8");
          decrypted += decipher.final("utf8");

          return decrypted;
     } catch (error) {
          console.error("Error en decrypt:", error.message);
          throw error; // Propaga el error para manejarlo en el modelo
     }
};
module.exports = { encrypt, decrypt };
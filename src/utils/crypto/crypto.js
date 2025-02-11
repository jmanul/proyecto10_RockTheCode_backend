const crypto = require('crypto');

const encrypt = (text, keySecret) => {
     try {
          const key = Buffer.from(keySecret, "hex");
          if (key.length !== 32) throw new Error("La clave debe ser de 32 bytes para AES-256.");
          const iv = crypto.randomBytes(16);
          const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
          let encrypted = cipher.update(text, "utf8", "base64");
          encrypted += cipher.final("base64");
          return `${iv.toString("base64")}:${encrypted}`;
     } catch (error) {
          console.error("Error al cifrar:", error.message);
          throw error;
     }
};

const decrypt = (encryptedText, keySecret) => {
     try {
       
          // Validar la clave
          const key = Buffer.from(keySecret, "hex");
          if (key.length !== 32) throw new Error("La clave debe ser de 32 bytes para AES-256.");

          // Validar el formato del texto cifrado
          const parts = encryptedText.split(":");
          if (parts.length !== 2) throw new Error("El texto cifrado no tiene el formato correcto.");

          const iv = Buffer.from(parts[0], "base64");
          const encrypted = Buffer.from(parts[1], "base64");

          // Descifrar
          const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
          let decrypted = decipher.update(encrypted, "base64", "utf8");
          decrypted += decipher.final("utf8");

          return decrypted;
     } catch (error) {
          console.error("Error al descifrar:", error.message);
          throw error;
     }
};

module.exports = { encrypt, decrypt };


const crypto = require('crypto');



const encrypt = (text, keySecret) => {
     const key = Buffer.from(keySecret, "hex");
     const iv = crypto.randomBytes(16);
     const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
     let encrypted = cipher.update(text, "utf8", "base64");
     encrypted += cipher.final("base64");
     return `${iv.toString("base64")}:${encrypted}`;
};


const decrypt = (encryptedText, keySecret) => {


     const key = Buffer.from(keySecret, "hex");
     const parts = encryptedText.split(":");
     const iv = Buffer.from(parts[0], "base64");
     const encrypted = Buffer.from(parts[1], "base64");
     const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
     let decrypted = decipher.update(encrypted, "base64", "utf8");
     decrypted += decipher.final("utf8");

     return decrypted;
};

module.exports = { encrypt, decrypt };
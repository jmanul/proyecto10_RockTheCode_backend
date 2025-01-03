
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({

     userName: { type: String, required: true, unique: true, trim: true },
     password: { type: String, required: true, trim: true },
     email: { type: String, required: false, trim: true },
     roll: { type: String, enum: ["user", "administrator"], default: "user", trim: true },
     avatar: {
          type: String, default: "https://res.cloudinary.com/dn6utw1rl/image/upload/v1735935945/default/icon-perfil_fwo69s.webp"},
     events: [{ type: mongoose.Types.ObjectId, ref: 'event', required: false }]

},
     {
          timestamps: true,
          collection: 'users'
     });

userSchema.pre("save", function () {

     this.password = bcrypt.hashSync(this.password, 10);
});


const User = mongoose.model('users', userSchema, 'users');

module.exports = User;
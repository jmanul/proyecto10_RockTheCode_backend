
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({

     userName: { type: String, required: true, unique: true, trim: true },
     password: { type: String, required: true, trim: true, select: false },
     email: { type: String, required: false, trim: true },
     roll: { type: String, enum: ["user", "administrator"], default: "user", trim: true },
     avatar: {
          type: String, default: "https://res.cloudinary.com/dn6utw1rl/image/upload/v1736008037/default/default-person-EDIT_vonfhq.jpg"},
     eventsIds: [{ type: mongoose.Types.ObjectId, ref: 'events', required: false }],
     ticketsIds: [{ type: mongoose.Types.ObjectId, ref: 'tickets', required: false }]

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
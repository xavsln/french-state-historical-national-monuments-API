const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');

let monumentSchema = mongoose.Schema({
  name: { type: String, required: true },
  wikipediaLinkEn: { type: String, required: true },
  type: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  cityLocation: { type: String, required: true },
  departmentLocation: { type: String, required: true },
  regionLocation: { type: String, required: true },
  remarks: String
});

// let userSchema = mongoose.Schema({
//   Username: { type: String, required: true },
//   Password: { type: String, required: true },
//   Email: { type: String, required: true },
//   Birthday: Date,
//   favoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
//   Role: { type: String, enum: ["user", "admin"], default: "user" }
// });

// userSchema.statics.hashPassword = password => {
//   return bcrypt.hashSync(password, 10);
// };

// userSchema.methods.validatePassword = function(password) {
//   return bcrypt.compareSync(password, this.Password);
// };

let Monument = mongoose.model('Monument', monumentSchema);
// let User = mongoose.model("User", userSchema);

module.exports.Monument = Monument;
// module.exports.User = User;

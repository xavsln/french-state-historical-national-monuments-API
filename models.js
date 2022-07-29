const mongoose = require("mongoose");
// const bcrypt = require('bcrypt');

let monumentSchema = mongoose.Schema({
  Name: { type: String, required: true },
  WikipediaLinkEn: { type: String, required: true },
  Type: { type: String, required: true },
  Latitude: { type: Number, required: true },
  Longitude: { type: Number, required: true },
  CityLocation: { type: String, required: true },
  DepartmentLocation: { type: String, required: true },
  RegionLocation: { type: String, required: true },
  Remarks: String
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

let Monument = mongoose.model("Monument", monumentSchema);
// let User = mongoose.model("User", userSchema);

module.exports.Monument = Monument;
// module.exports.User = User;

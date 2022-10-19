const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

let monumentSchema = mongoose.Schema({
  name: { type: String, required: true },
  wikipediaLinkEn: { type: String, required: true },
  type: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  cityLocation: { type: String, required: true },
  departmentLocation: { type: String, required: true },
  regionLocation: { type: String, required: true },
  thumbImgUrl: {
    type: String,
    required: true,
    default: "https://via.placeholder.com/250",
  },
  remarks: String,
});

let userSchema = mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  birthday: Date,
  favoriteMonuments: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Monument" },
  ],
  role: { type: String, enum: ["user", "admin"], default: "user" },
});

userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

let Monument = mongoose.model("Monument", monumentSchema);
let User = mongoose.model("User", userSchema);

module.exports.Monument = Monument;
module.exports.User = User;

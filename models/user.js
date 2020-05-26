const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique:true,
      match: /@/
    },
    password: {
      type: String,
      minlength: 6,
      maxlength: 18,
      unique:true
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function(next) {
  if (this.password && this.isModified("password")) {
    bcrypt.hash(this.password, 10, (err, password) => {
      err ? next(err) : (this.password = password);
      next();
    });
  } else {
      next();
  }
});

userSchema.methods.verifyPassword = function (password){
    return bcrypt.compareSync(password,this.password);
  }

module.exports = mongoose.model("User", userSchema);
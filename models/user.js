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
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    isBlocked:{
      type: Boolean,
      default: false
    },
    isActive:{
      type: Boolean,
      default: false
    },
    activeToken: {
      type: String,
    },
    personalcart:[{
      item:{
        type: Schema.Types.ObjectId,
        ref:"Book",
      },
      quantity:{
          type: Number,
      }
    }],
    wishList:[{
      type: Schema.Types.ObjectId,
      ref: "Book"
    }],
    purchases:[{
      type: Schema.Types.ObjectId,
      ref: "Parchase"
    }],
    hasDefaultAddress: {
      type: Boolean,
      default: false
    },
    defaultAddress:{
      type: Schema.Types.ObjectId,
      ref: "Address"
    },
    addresses:[{
      type: Schema.Types.ObjectId,
      ref: "Address"
    }]
  },
  { timestamps: true }
);


userSchema.pre('save', async function(next){
  var adminEmails = ['anshu.saurav@gmail.com'];
  if(this.password && this.isModified('password')) {
      try{
        this.password = await bcrypt.hash(this.password, 10);
        if(adminEmails.includes(this.email)) {
          this.isAdmin = true;
        }
        next();
      }
      catch(error) {
        next("Error with password");
      }
  }
  
  next();
});

userSchema.methods.verifyPassword = async function(pwd) {
  try{
  const match = await bcrypt.compare(pwd, this.password); 
  // console.log(match);
  if(match && !this.isBlocked)
      return true;    
  else 
      return false;
  }
  catch(err){
    return false;
  }
}


module.exports = mongoose.model("User", userSchema);
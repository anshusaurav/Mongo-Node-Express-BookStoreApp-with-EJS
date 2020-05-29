const mongoose = require("mongoose");
var Schema = mongoose.Schema;


var verificationCodeSchema = new Schema({
    
    code:{
        type: String,
        required: true
    },
    user:{
        type:Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},{timestamps: true});

module.exports = mongoose.model("VerificationCode", verificationCodeSchema);

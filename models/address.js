const mongoose = require("mongoose");
var Schema = mongoose.Schema;


var addressSchema = new Schema({
    street: String, 
    number: String, 
    zip: String, 
    city: String,
    state: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    
},{timestamps: true});

module.exports = mongoose.model("Review", reviewSchema);

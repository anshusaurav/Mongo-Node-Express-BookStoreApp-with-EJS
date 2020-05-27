const mongoose = require("mongoose");
var Schema = mongoose.Schema;


var reviewSchema = new Schema({
    
    content: {
        type: String,
        required: true,
    },
    book: {
        type: Schema.Types.ObjectId,
        ref: "Book",
        required: true,
    },
    buyer: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},{timestamps: true});

module.exports = mongoose.model("Review", reviewSchema);

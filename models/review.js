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
    },
    buyer: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
},{timestamps: true});

module.exports = mongoose.model("Review", reviewSchema);

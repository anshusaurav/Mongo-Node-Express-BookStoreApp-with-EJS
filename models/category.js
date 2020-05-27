const mongoose = require("mongoose");
var Schema = mongoose.Schema;


var categorySchema = new Schema({
    
    categoryName: {
        type: String,
        required: true,
    },
    books: [{
        type: Schema.Types.ObjectId,
        ref: "Book"
    }]
},{timestamps: true});

module.exports = mongoose.model("Category", categorySchema);

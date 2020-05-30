const mongoose = require("mongoose");
var slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
var Schema = mongoose.Schema;


var categorySchema = new Schema({
    
    categoryName: {
        type: String,
        required: true,
    },
    slug:{
        type: String, 
        slug: ["categoryName"], 
        unique: true 
    },
    books: [{
        type: Schema.Types.ObjectId,
        ref: "Book"
    }]
},{timestamps: true});

module.exports = mongoose.model("Category", categorySchema);

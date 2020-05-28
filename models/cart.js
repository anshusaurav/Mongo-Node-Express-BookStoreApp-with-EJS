const mongoose = require("mongoose");
var Schema = mongoose.Schema;
var User = require('../models/user');
var Book = require('../models/book');

var cartSchema = new Schema({
    
    books: [{
        book:{
            type: Schema.Types.ObjectId,
            ref:"Book",
            required: true
        },
        quantity:{
            type: Number,
            required: true
        }
    }],
    buyer: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    totalPrice:{
        type: Number,
        required: true,
        default: 0
    }

},{timestamps: true});
cartSchema.pre('update', async function(next){
    
    try{

    }
    catch(error) {
        next("Error with books");
    }
    next();
  });
module.exports = mongoose.model("Cart", cartSchema);

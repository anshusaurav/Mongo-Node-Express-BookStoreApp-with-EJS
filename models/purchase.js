const mongoose = require("mongoose");
var Schema = mongoose.Schema;


var purchaseSchema = new Schema({
    
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
    },
    addressShippedTo:{
        type: Schema.Types.ObjectId,
        ref: "Address"
    }
    
},{timestamps: true});

module.exports = mongoose.model("Purchase", purchaseSchema);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bookSchema = new Schema(
  {
    title: {
        type: String,
        required: true
    },
    author:{
        type: String,
        required: true,

    },
    description:{
        type: String, 
        required: true,
    },
    categories:[{
        type: Schema.Types.ObjectId,
        ref:"Category"
    }],
    price:{
        type: Number,
        required: true
    },
    quantity:{
        type: Number,
        required: true
    },
    ratings:[{
        buyer:{
            type: Schema.Types.ObjectId,
            ref:"User",
            required: true
        },
        rating:{
            type: Number,
            required: true
        }
    }],
    reviews:[{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }]
  },
  { timestamps: true }
);



module.exports = mongoose.model("Book", bookSchema);
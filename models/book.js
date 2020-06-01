const mongoose = require("mongoose");
var slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
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
    slug: { 
        type: String, 
        slug: ["title"], 
        unique: true 
    },
    publisher:{
        type: String,
        required: true
    },
    thumbnailURL:{
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

bookSchema.index({title: "text", author: "text"});
module.exports = mongoose.model("Book", bookSchema);
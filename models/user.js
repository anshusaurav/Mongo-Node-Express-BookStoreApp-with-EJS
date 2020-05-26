var mongoose = require('mongoose');
var {hash, compare} = require('bcrypt');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    username:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
    },
    bio: String,
    image: String,
    articles: [{
        type: Schema.Types.ObjectId,
        ref: "Article",
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: "Comment",
    }],

    favoriteArticles: [{
        type: Schema.Types.ObjectId,
        ref: "Article",
    }],

    followers: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    following: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }]

}, {timestamps: true});
userSchema.pre('save', async function(next){
    try{
        if(this.password && this.isModified('password')) {
            this.password = await hash(this.password, 10);
            return next();
        }
    }
    catch(error) {
        return next(error);
    }
});

userSchema.methods.verifyPassword = async function(pwd) {
    return await compare(pwd, this.password); 
}
module.exports = mongoose.model("User", userSchema);
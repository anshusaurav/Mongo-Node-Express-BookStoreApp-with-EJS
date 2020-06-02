const Category = require("../models/category");
exports.fetchAllCategories = async(req, res, next) =>{
    try{
        let catForHeader = await Category.find({}).populate('books');
        res.locals.catForHeader = catForHeader;
        next();
    }
    catch(error) {
        return next('invalid userId in schema');

    }
}
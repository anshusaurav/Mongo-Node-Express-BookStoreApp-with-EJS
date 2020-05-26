var jwt = require('jsonwebtoken');
exports.generateJWT = async(user) =>{
    //scret should be passed via .env
    try{
        var token = await jwt.sign({userId: user.id},"Secret-Key");
        return token;
    }
    catch(error){
        return error;
    }

}

exports.verifyToken = async (req, res, next) =>{
    var token = req.headers.authorization || "";
    try{
        if(token) {
            var payload = await jwt.verify(token,"Secret-Key");
            console.log(payload);
            var user = {
                userId: payload.userId,
                token: token
            };
            req.user = user;
            next();
        }
        else{
            return res.status(401).json({
                success: false,
                error: "Unauthorized"
            });
        }
    }
    catch(error){
        return res.status(422).json({
            success: false,
            error: "Unexpected error"
        });
    }
};
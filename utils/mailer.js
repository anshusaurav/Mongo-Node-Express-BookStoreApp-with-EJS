
var nodemailer = require('nodemailer');

var config = {
    service: "Gmail",
    auth: {
        user: 'anshu.saurav@gmail.com',
        pass: 'yourpassword'
    }
};
    
var transporter = nodemailer.createTransport(config);

var defaultMail = {
    from: 'Me <xxx@126.com>',
    text: 'test text',
};

module.exports = function(mail){

    
    // send email
    transporter.sendMail(mail, function(error, info){
        if(error) return console.log(error);
        console.log('mail sent:', info.response);
    });
};
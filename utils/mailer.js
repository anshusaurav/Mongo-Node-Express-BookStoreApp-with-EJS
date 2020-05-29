
var nodemailer = require('nodemailer');
var _ = require('lodash');
var config = {
    service: "gmail",
    auth: {
        user: process.env.Email,
        pass: process.env.Password
    }
};
    
var transporter = nodemailer.createTransport(config);

var defaultMail = {
    from: 'Me <anshu.saurav@gmail.com>',
    text: 'test text',
};

module.exports = function(mail){

    mail = _.merge({}, defaultMail, mail);
    // send email
    transporter.sendMail(mail, function(error, info){
        if(error) return console.log(error);
        console.log('mail sent:', info.response);
    });
};
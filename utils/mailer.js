
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

module.exports = function send(mail){

    mail = {from: process.env.Email,
    to: 'friendsofenron@gmail.com, enemiesofenron@gmail.com',
    subject: 'Invoices due',
    text: 'Dudes, we really need your money.'};
    console.log(mail);
    // send email
    transporter.sendMail(mail, function(error, info){
        console.log('Error', error);
        if(error) return console.log(error);
        console.log('mail sent:', info.response);
    });
};
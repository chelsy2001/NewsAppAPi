var _= require('lodash');

const nodemailer = require('nodemailer');

var config = {
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: 'chelsyyadav22@gmail.com',
        pass: 'Chelsy@123'
    }
};

var transporter = nodemailer.createTransport(config);

var defalutMail = {
    from: 'chelsyyadav@gmail.com',
    text: 'test test'
}

const send = (to, subject , html) => {
    
    mail = _.merge({html}, defalutMail,to);

    transporter.sendMail(mail, function(error,info) {
        if ( error) return console.log(error);
        console.log('mail sent' , info.response);
    }
)
}

module.exports = {
    send
}
const User = require('../models/UserModel');
const mailer = require('../utils/Mailer');
const generateToken = require('../utils/generateToken');
const crypto = require('crypto');

const registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await User.findOne({ email });

        if (userExists && userExists.active) {
            return res.status(400).json({
                success: false,
                msg: 'Entered email id is already registered with us, login to continue'
            });
        } else if (userExists && !userExists.active) {
            return res.status(400).json({
                success: false,
                msg: 'Account created but needs to be activated, a link was sent to your registered email'
            });
        }

        const user = new User({ name, email, password });

        crypto.randomBytes(20, async (err, buf) => {
            if (err) {
                return next(err);
            }

            user.activeToken = user._id + buf.toString('hex');
            user.activeExpires = Date.now() + 24 * 3600 * 1000;
            
            const link = process.env.NODE_ENV === 'development' 
                ? `http://localhost:${process.env.PORT}/api/users/activate/${user.activeToken}`
                : `${process.env.api_host}/api/users/activate/${user.activeToken}`;

            mailer.send({
                to: req.body.email,
                subject: 'Welcome',
                html: `Please click <a href="${link}">here</a> to activate your account.`
            });

            try {
                await user.save();
                res.status(201).json({
                    success: true,
                    msg: `The activation email has been sent to ${user.email}. Please click the activation link.`
                });
            } catch (err) {
                return next(err);
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            msg: 'Server is having some issues'
        });
    }
};

module.exports = {
    registerUser
};

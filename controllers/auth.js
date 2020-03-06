const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const keys = require('../config/keys');

module.exports.login = async function (req, res) {
    const candidate = await User.findOne({email: req.body.email});

    if (candidate) {
        // проверка пароля, пользователь существует
        const passwordResult = bcrypt.compareSync(req.body.password, candidate.password);
        if (passwordResult) {
            const token = jwt.sign({
                email: candidate.email,
                userId: candidate._id
            },
                keys.jwt,
                {
                expiresIn: 60 * 60
            });

            res.status(200).json({
                token: `bearer ${token}`
            });
        } else {
            // пароли не совпали
            res.status(401).json({
                message: 'Wrong. password.'
            });
        }
    } else {
        // пользователь не найден
        res.status(404).json({
            message: 'User with this email not found.'
        })
    }
};

module.exports.register = async function (req, res) {
    const candidate = await User.findOne({email: req.body.email});
    if (candidate) {
        //User already present
        res.status(409).json({
            message: 'Email already exist'
        });
    } else {
        //create User
        const salt = bcrypt.genSaltSync(10);
        const password = req.body.password;
        const user = new User({
            email: req.body.email,
            password: bcrypt.hashSync(password, salt)
        });
        try {
            await user.save();
            res.status(201).json(user);
        } catch (e) {
            //process error

        }

    }
};


// ИЗМЕНЕНИЯ В ЛОКАЛЬНОЙ ВЕТКЕ

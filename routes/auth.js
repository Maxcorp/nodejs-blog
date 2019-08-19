const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt-nodejs');
const models = require('../models');

//registration
router.post('/register', (req, res) => {
    const login = req.body.login;
    const password = req.body.password;
    const passwordConfirm = req.body.passwordConfirm;

    if(!login || !password || !passwordConfirm) {
        const fields = [];
        
        if(!login) {
            fields.push('login');
        }

        if(!password) {
            fields.push('password');
        }

        if(!passwordConfirm) {
            fields.push('passwordConfirm');
        }

        res.json({
            ok: false,
            error: "Все поля должны быть заполнены.",
            fields: fields
        });
    } else if(login.length < 3 || login.length > 16) {
        res.json({
            ok: false,
            error: "Длина логина должна быть от 3 до 16 символов.",
            fields: ['login']
        });
    } else if(password != passwordConfirm) {
        res.json({
            ok: false,
            error: "Пароли не совпадают",
            fields: ['password', 'confirmPassword']
        });
    } else {
        bcrypt.hash(password, null, null, (err, hash) => {
            models.User.create({
                login,
                password: hash
            }).then((user) => {
                console.log(user);
                res.json({
                    ok: true
                });
            }).catch((err) => {
                console.log(err);
                res.json({
                    ok: false,
                    error: "Ошибка при регистрации",
                });
            });
        });
    }
});

router.post('/login', (req, res) => {
    const login = req.body.login;
    const password = req.body.password;

    if(!login || !password) {
        const fields = [];
        
        if(!login) {
            fields.push('login');
        }

        if(!password) {
            fields.push('password');
        }

        res.json({
            ok: false,
            error: "Все поля должны быть заполнены.",
            fields: fields
        });
    } else {
        models.User.findOne({
            login
        }).then(user => {
            if (!user) {
                res.json({
                  ok: false,
                  error: 'Логин и пароль неверны!',
                  fields: ['login', 'password']
                });
              } else {
                bcrypt.compare(password, user.password, function(err, result) {
                    console.log(result);
                  if (!result) {
                    res.json({
                      ok: false,
                      error: 'Логин и пароль неверны!',
                      fields: ['login', 'password']
                    });
                  } else {
                    console.log(result);
                    req.session.userId = user.id;
                    req.session.userLogin = user.login;
                    req.session.userRole = 'user';
      
                    res.json({
                      ok: true
                    });
                  }
                });
              }
        }).catch((err) => {
            console.log(err);
            res.json({
                ok: false,
                error: "Ошибка авторизации.",
            });
        });
    }
});

// GET for logout
router.get('/logout', (req, res) => {
    if (req.session) {
      req.session.destroy(() => {
        res.redirect('/');
      });
    } else {
      res.redirect('/');
    }
  });

module.exports = router;
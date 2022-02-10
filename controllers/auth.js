const { Router } = require('express');
const { body, validator, validationResult } = require('express-validator');
const { mapError } = require('../services/util');

const router = Router();

router.get('/register', (req, res) => {
    res.render('register', { title: 'Register' });
});

router.post('/register',
    body('username').trim(),
    body('password').trim(),
    body('repeatPassword').trim(),
    body('username')
        // You should change min
        .isLength({ min: 3 }).withMessage('Username should be longer than 4 charachters')
        .isAlphanumeric().withMessage('Username should contain only numbers and letters'),
    body('password')
        // You should change min
        .isLength({ min: 3 }).withMessage('Password should be longer than 8 charachters'),
    body('repeatPassword')
        .custom((value, { req }) => value == req.body.password)
        .withMessage('Repeated password doesn\'t match'),
    async (req, res) => {
        const { errors } = validationResult(req);

        try {
            if (errors.length > 0) {
                throw errors;
            }
            await req.auth.register(req.body.username, req.body.password);
            res.redirect('/');
        } catch (err) {
            res.locals.errors = mapError(err);
            res.render('register', { title: 'Register', data: { username: req.body.username } });
        }
    });

router.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});

router.post('/login', async (req, res) => {
    try {
        await req.auth.login(req.body.username, req.body.password);
        res.redirect('/')
    } catch (err) {
        res.locals.errors = mapError(err);
        res.render('login', { title: 'Login' });
    }
});

router.get('/logout', (req, res) => {
    req.auth.logout();
    res.redirect('/');
});

module.exports = router;
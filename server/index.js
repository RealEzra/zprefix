const express = require('express')
const app = express()
const knex = require('knex')(require('./knexfile')[process.env.NODE_ENV || 'development']);
const rateLimit = require('express-rate-limit');
const session = require("express-session");
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const cors = require('cors')
require('dotenv').config()
const url = process.env.FRONT_ENDPOINT;


const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 1000, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Redis, Memcached, etc. See below.
})

const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect(`${url}/login`);
    }
};
app.use(cookieParser());

app.use(
    session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false,
    })
);
app.use(limiter);
app.use(express.json());
app.use(cors())

// End Imports/Setup

app.get('/', isAuthenticated, (req, res) => {
    res.redirect(`${url}/login`)
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hash = await knex('users').select("password").where({ 'username': username.toLowerCase() }).then(data => data[0].password)
        if (bcrypt.compareSync(password, hash)) {
            req.session.user = username;
            res.cookie("sessionId", req.sessionID)
            knex('users').where({ 'username': username.toLowerCase() }).update({ 'session_id': req.sessionID }).catch((err) => console.log(err));
            // res.redirect(`${url}/profile`)
            res.status(200).send({cookie: req.sessionID})
        } else {
            res.status(400).send({ error: "Incorrect Username or Password!" })
        }

    } catch {
        res.status(400).send({ error: "Incorrect Username or Password!" })
    }
})



module.exports = app;
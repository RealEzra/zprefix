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

// --LOGIN/SIGNUP--

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hash = await knex('users').select("password").where({ 'username': username.toLowerCase() }).then(data => data[0].password)
        if (bcrypt.compareSync(password, hash)) {
            req.session.user = username;
            res.cookie("sessionId", req.sessionID)
            knex('users').where({ 'username': username.toLowerCase() }).update({ 'session_id': req.sessionID }).catch((err) => console.log(err));
            // res.redirect(`${url}/profile`)
            const firstName = await knex('users').select('first_name').where({'username': username.toLowerCase()}).then(data => data[0].first_name)
            res.status(200).send({cookie: req.sessionID, user: firstName })
        } else {
            res.status(400).send({ error: "Incorrect Username or Password!" })
        }

    } catch {
        res.status(400).send({ error: "Incorrect Username or Password!" })
    }
})

app.post('/sign-up', async (req,res) => {
    const {username, password, firstname, lastname} = req.body;
    try {
        const user = await knex('users').select('username').where({'username': username.toLowerCase()}).then(data => data)
        if (user.length > 0) {
            res.status(400).send({error: "That username already exists!"})
        } else {
            const hash = bcrypt.hashSync(password, 10);
            knex("users").insert({username: username, first_name: firstname, last_name: lastname, password: hash}).catch(err => console.log(err))
            res.status(201).send({success: "Account created please login!"})
        }
    } catch {
        res.status(400).send({error: "something went wrong!"})
    }
})

// --USERS--
app.get('/user/:id', async (req, res) => {
    knex('users').select('*').where({'id': req.params.id}).then(data => res.status(200).send(data[0]))
})

// --ITEMS--

app.post('/item', async (req, res) => {
    if (req.body.session === null) {
        res.status(400).send({error: "Session token not found please try logging in again!"})
    } else {
        try {
            const userid = await knex('users').select('id').where({"session_id": req.body.session}).then(data => data[0].id).catch(err => console.log(err))
            if (!userid) {
                res.status(400).send({error: "Your session token is invalid please login again!"})
            } else {
                knex('item').insert({user_id: userid, item_name: req.body.item_name, description: req.body.description, quantity: req.body.quantity}).catch(err => console.log(err))
                res.status(201).send({success: "New item has been created"})
            }

        } catch {
            res.status(503).send({error: "Server error please try again later!"})
        }
    }
})

app.delete('/item', async (req, res) => {
    if (req.body.session === null) {
        res.status(400).send({error: "Session token not found please try logging in again!"})
    } else {
        try {
            const userid = await knex('users').select('id').where({"session_id": req.body.session}).then(data => data[0].id).catch(err => console.log(err))
            if (!userid) {
                res.status(400).send({error: "Your session token is invalid please login again!"})
            } else {
                knex('item').where({'id': req.body.id}).del().catch(err => console.log(err))
                res.status(200).send({alert: "Item was successfully deleted!"})

            }

        } catch {
            res.status(503).send({error: "Server error please try again later!"})
        }
    }
})

app.get('/item/:id', (req, res) => {
    knex('item').select('*').where({'id': req.params.id}).then(data => res.status(200).send(data[0]))
})

app.get('/items', (req, res) => {
    knex('item').select('*').then(data => res.status(200).send(data))
})

app.get('/items/:user', async (req,res) => {
    const user = req.params.user
    try{
        const userid = await knex('users').select('id').where({'username': user.toLowerCase()}).then(data => data[0].id)
        const items = await knex('item').select('*').where({'user_id': userid}).then(data => res.status(200).send(data))

    } catch {
        res.status(400).send({error: "User not found!"})
    }

})

app.patch('/item', async (req, res) => {
    if (req.body.session === null) {
        res.status(400).send({error: "Session token not found please try logging in again!"})
    } else {
        try {
            const userid = await knex('users').select('id').where({"session_id": req.body.session}).then(data => data[0].id).catch(err => console.log(err))
            if (!userid) {
                res.status(400).send({error: "Your session token is invalid please login again!"})
            } else {
                knex('item').where({'id': req.body.id}).update({
                    item_name: req.body.item_name,
                    description: req.body.description,
                    quantity: req.body.quantity
                }).catch(err => console.log(err))
                res.status(200).send({info: "Item was successfully updated!"})

            }

        } catch {
            res.status(503).send({error: "Server error please try again later!"})
        }
    }
})

// --AUTH--

app.post('/isvalid', async (req, res) => {
    if (req.body.session === null) {
        res.status(400).send({invalid: "Session token not found please try logging in!"})
    } else {
        try {
            const userid = await knex('users').select('id').where({"session_id": req.body.session}).then(data => data[0].id).catch(err => console.log(err))
            if (!userid) {
                res.status(400).send({invalid: "Your session token is invalid please login again!"})
            } else {
                res.status(200).send({success: "Session token is valid! ;)"})

            }

        } catch {
            res.status(503).send({error: "Ping request to server failed!"})
        }
    }

})



module.exports = app;
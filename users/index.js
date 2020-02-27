const express = require("express");
const body = require("body-parser");

const app = express();
const PORT = process.env.PORT || 8083;

app.use(body.json());

var redis = require("redis"),
    client = redis.createClient('redis://h:p29e259de18247f84c2ea5b4407c9b6bd0ea37d8b21e79fe1711c5f9a5951e5af@ec2-3-223-193-164.compute-1.amazonaws.com:8439');

client.on("error", function (err) {
    console.log("Error " + err);
});

client.set('users', JSON.stringify({
    'login1': {
        name: '111',
        films: ['a', 'b']
    },
    'login2': {
        name: '222',
        films: ['c', 'b']
    },
    'login3': {
        name: '333',
        films: ['a', 'c']
    }
}) , function () {});

app.get("/allUsers", function(req, res)
{
    client.get('users', function(err, reply) {
        res.status(200);
        res.send(JSON.stringify(reply));
    });
});

app.post("/addUsers", function(req, res)
{
    let users = req.body.users;

    if (!users) {
        res.status(404);
        res.send('undefined');
        return;
    }

    client.get('users', function(err, reply) {
        reply = JSON.parse(reply);
        console.log('addUsers', reply, users);

        const newUsers = {
            ...reply,
            ...users
        };

        client.set('users', JSON.stringify(newUsers), function(err, reply) {
            res.status(200);
            res.send('added');
        });
    });
});

app.post("/deleteUsers", function(req, res)
{
    let users = req.body.users;

    if (!users) {
        res.status(404);
        res.send('undefined');
        return;
    }

    client.get('users', function(err, reply) {
        reply = JSON.parse(reply);
        console.log('deleteUsers', reply, users);

        for (const user of users) {
            delete reply[user];
        }

        console.log('deleteUsers new', reply);

        client.set('users', JSON.stringify(reply), function(err, reply) {
            res.status(200);
            res.send('deleted');
        });
    });
});

app.post("/deleteUsersFilms", function(req, res)
{
    let films = req.body.films;

    if (!films) {
        res.status(404);
        res.send('undefined');
        return;
    }

    client.get('users', function(err, reply) {
        reply = JSON.parse(reply);
        console.log('deleteUsersFilms', reply, films);

        for (const login in reply) {
            reply[login].films = reply[login].films.filter((userFilm) => !films.includes(userFilm))
        }

        console.log('deleteUsersFilms new', reply);

        client.set('users', JSON.stringify(reply), function(err, reply) {
            res.status(200);
            res.send('deleted');
        });
    });
});

app.listen(PORT);
console.log("Server launched");

module.exports.app = app;

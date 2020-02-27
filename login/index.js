const express = require("express");
const body = require("body-parser");

const app = express();
const PORT = process.env.PORT || 8082;

app.use(body.json());

var redis = require("redis"),
    client = redis.createClient('redis://h:p29e259de18247f84c2ea5b4407c9b6bd0ea37d8b21e79fe1711c5f9a5951e5af@ec2-3-223-193-164.compute-1.amazonaws.com:8439');

client.on("error", function (err) {
    console.log("Error " + err);
});

client.set('logins', JSON.stringify({
    'login1': 'login111',
    'login2': 'login222',
    'login3': 'login333'
}) , function () {});

app.post("/checkLogin", function(req, res)
{
    let login = req.body.login;
    let password = req.body.password;

    if (!login || !password) {
        res.status(404);
        res.send('undefined');
        return;
    }

    client.get('logins', function(err, reply) {
        reply = JSON.parse(reply);
        console.log('checkLogin', reply);

        if (reply[login] !== undefined && reply[login] === password) {
            res.status(200);
            res.send(JSON.stringify({answer: 'ok'}));
        } else {
            res.status(200);
            res.send(JSON.stringify({answer: 'password not ok'}));
        }
    });
});

app.post("/addLogins", function(req, res)
{
    let logins = req.body.logins;

    console.log(logins);

    if (!logins) {
        res.status(404);
        res.send('undefined');
        return;
    }

    client.get('logins', function(err, reply) {
        reply = JSON.parse(reply);
        console.log('addLogins', reply, logins);

        const newLogins = {
            ...reply,
            ...logins
        };

        client.set('logins', JSON.stringify(newLogins), function(err, reply) {
            res.status(200);
            res.send('added');
        });
    });
});

app.post("/deleteLogins", function(req, res)
{
    let logins = req.body.logins;

    if (!logins) {
        res.status(404);
        res.send('undefined')
        return;
    }

    client.get('logins', function(err, reply) {
        reply = JSON.parse(reply);
        console.log('deleteLogins', reply, logins);

        for (const login of logins) {
            delete reply[login];
        }

        console.log('deleteLogins new', reply);

        client.set('logins', JSON.stringify(reply), function(err, reply) {
            res.status(200);
            res.send('deleted');
        });
    });
});

app.listen(PORT);
console.log("Server launched");

module.exports.app = app;

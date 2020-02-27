const express = require("express");
const body = require("body-parser");

const app = express();
const PORT = process.env.PORT || 8081;

app.use(body.json());

var redis = require("redis"),
    client = redis.createClient('redis://h:p29e259de18247f84c2ea5b4407c9b6bd0ea37d8b21e79fe1711c5f9a5951e5af@ec2-3-223-193-164.compute-1.amazonaws.com:8439');

client.on("error", function (err) {
    console.log("Error " + err);
});

client.set('films', JSON.stringify({
    'a': 1,
    'b': 2,
    'c': 3
}) , function () {});

app.get("/allFilms", function(req, res)
{
    client.get('films', function(err, reply) {
        res.status(200);
        res.send(JSON.stringify(reply));
    });
});

app.post("/addFilms", function(req, res)
{
    let films = req.body.films;

    if (!films) {
        res.status(404);
        res.send('undefined');
        return;
    }

    client.get('films', function(err, reply) {
        reply = JSON.parse(reply);
        console.log('addFilms', reply, films);

        const newFilms = {
            ...reply,
            ...films
        };

        client.set('films', JSON.stringify(newFilms), function(err, reply) {
            res.status(200);
            res.send('added');
        });
    });
});

app.post("/deleteFilms", function(req, res)
{
    let films = req.body.films;

    if (!films) {
        res.status(404);
        res.send('undefined')
        return;
    }

    client.get('films', function(err, reply) {
        reply = JSON.parse(reply);
        console.log('deleteFilms', reply, films);

        for (const film of films) {
            delete reply[film];
        }

        console.log('deleteFilms new', reply);

        client.set('films', JSON.stringify(reply), function(err, reply) {
            res.status(200);
            res.send('deleted');
        });
    });
});

app.listen(PORT);
console.log("Server launched");

module.exports.app = app;

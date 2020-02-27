const express = require("express");
const body = require("body-parser");
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(body.json());

app.post("/deleteFilms", function(req, res)
{
    let films = req.body.films;

    if (!films) {
        res.status(404);
        res.send('undefined');
        return;
    }

    const allFetch = [
        fetch('http://localhost:8083/deleteUsersFilms', {
            method: 'POST',
            body: JSON.stringify({'films': films}),
            headers:
                {
                    'Content-Type': 'application/json; charset=utf-8'
                }
        }),
        fetch('http://localhost:8081/deleteFilms', {
            method: 'POST',
            body: JSON.stringify({'films': films}),
            headers:
                {
                    'Content-Type': 'application/json; charset=utf-8'
                }
        })
    ];

    Promise.all(allFetch)
        .then(() => {
            res.status(200);
            res.send('deleted');
        });
});

app.post("/deleteUsers", function(req, res)
{
    let logins = req.body.logins;

    if (!logins) {
        res.status(404);
        res.send('undefined');
        return;
    }

    const allFetch = [
        fetch('http://localhost:8082/deleteLogins', {
            method: 'POST',
            body: JSON.stringify({'logins': logins}),
            headers:
                {
                    'Content-Type': 'application/json; charset=utf-8'
                }
        }),
        fetch('http://localhost:8083/deleteUsers', {
            method: 'POST',
            body: JSON.stringify({'users': logins}),
            headers:
                {
                    'Content-Type': 'application/json; charset=utf-8'
                }
        })
    ];

    Promise.all(allFetch)
        .then(() => {
            res.status(200);
            res.send('deleted');
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

    const logins = Object.keys(users).reduce((acc, login) => {
        return {
            ...acc,
            [login]: users[login].password
        }
    }, {});

    const addUsers = Object.keys(users).reduce((acc, login) => {
        const { password, ...user } = users[login];

        return {
            ...acc,
            [login]: user
        }
    }, {});

    const allFetch = [
        fetch('http://localhost:8082/addLogins', {
            method: 'POST',
            body: JSON.stringify({'logins': logins}),
            headers:
                {
                    'Content-Type': 'application/json; charset=utf-8'
                }
        }),
        fetch('http://localhost:8083/addUsers', {
            method: 'POST',
            body: JSON.stringify({'users': addUsers}),
            headers:
                {
                    'Content-Type': 'application/json; charset=utf-8'
                }
        })
    ];

    Promise.all(allFetch)
        .then(() => {
            res.status(200);
            res.send('added');
        });
});

app.post("/login", function(req, res)
{
    let login = req.body.login;
    let password = req.body.password;

    if (!login || !password) {
        res.status(404);
        res.send('undefined');
        return;
    }

    const allFetch = [
        fetch('http://localhost:8082/checkLogin', {
            method: 'POST',
            body: JSON.stringify({'login': login, 'password': password}),
            headers:
                {
                    'Content-Type': 'application/json; charset=utf-8'
                }
        })
            .then((responce) => responce.json()),
    ];

    Promise.all(allFetch)
        .then((responce) => {
            console.log(responce);

            if (responce[0].answer === 'ok') {
                res.status(200);
                res.send('logined');
                return;
            }

            res.status(404);
            res.send('not logined');
        });
});

app.post("/userMoney", function(req, res)
{
    let login = req.body.login;

    if (!login) {
        res.status(404);
        res.send('undefined');
        return;
    }

    const allFetch = [
        fetch('http://localhost:8083/allUsers', {
            method: 'GET'
        })
            .then((res) => res.json()),
        fetch('http://localhost:8081/allFilms', {
            method: 'GET'
        })
            .then((res) => res.json())
    ];

    Promise.all(allFetch)
        .then((responce) => {
            console.log(responce);
            const users = JSON.parse(responce[0]);
            const films = JSON.parse(responce[1]);

            const userFilms = users[login].films;

            let c = 0;
            for (const film in films) {
                if (userFilms.includes(film)) {
                    c += Number(films[film])
                }
            }

            res.status(200);
            res.send(c.toString());
        });
});

app.post("/allUsername", function(req, res)
{
    let from = req.body.from;
    let to = req.body.to;

    const allFetch = [
        fetch('http://localhost:8083/allUsers', {
            method: 'GET'
        })
            .then((res) => res.json())
    ];

    Promise.all(allFetch)
        .then((responce) => {
            console.log(responce);
            const users = JSON.parse(responce[0]);

            const usersNames = Object.keys(users).map((login) => {
                return users[login].name;
            });

            res.status(200);
            res.send(JSON.stringify({ans: usersNames.slice(from, to)}));
        });
});

app.listen(PORT);
console.log("Server launched");

module.exports.app = app;

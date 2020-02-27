const request = require("supertest");
var app = require("./index").app;

describe('Users', function() {
    it("allUsers", function(done) {
        request(app)
            .get("/allUsers")
            .expect(200)
            .end(done);
    });

    it("addUsers 404", function(done) {
        request(app)
            .post("/addUsers")
            .send({})
            .expect(404)
            .end(done);
    });

    it("addUsers 200", function(done) {
        request(app)
            .post("/addUsers")
            .send({ "users": {
                    "login4": {
                        "name": "111",
                        "films": ["a", "b"]
                    },
                    "login5": {
                        "name": "222",
                        "films": ["c", "b"]
                    },
                    "login6": {
                        "name": "333",
                        "films": ["a", "c"]
                    }
                }})
            .expect(200)
            .end(done);
    });

    it("deleteUsers 404", function(done) {
        request(app)
            .post("/deleteUsers")
            .send({})
            .expect(404)
            .end(done);
    });

    it("deleteUsers 200", function(done) {
        request(app)
            .post("/deleteUsers")
            .send({ "users": [ "login4" ]})
            .expect(200)
            .end(done);
    });

    it("deleteUsersFilms 404", function(done) {
        request(app)
            .post("/deleteUsersFilms")
            .send({})
            .expect(404)
            .end(done);
    });

    it("deleteUsersFilms 200", function(done) {
        request(app)
            .post("/deleteUsersFilms")
            .send({ "films": [ "a" ]})
            .expect(200)
            .end(done);
    });
});

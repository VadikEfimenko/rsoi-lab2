const request = require("supertest");
var app = require("./index").app;

describe('Films', function() {
    it("allFilms", function(done) {
        request(app)
            .get("/allFilms")
            .expect(200)
            .end(done);
    });

    it("addFilms 404", function(done) {
        request(app)
            .post("/addFilms")
            .send({})
            .expect(404)
            .end(done);
    });

    it("addFilms 200", function(done) {
        request(app)
            .post("/addFilms")
            .send({ "films": {"z": 10}})
            .expect(200)
            .end(done);
    });

    it("deleteFilms 404", function(done) {
        request(app)
            .post("/deleteFilms")
            .send({})
            .expect(404)
            .end(done);
    });

    it("deleteFilms 200", function(done) {
        request(app)
            .post("/deleteFilms")
            .send({ "films": ["z"]})
            .expect(200)
            .end(done);
    });
});

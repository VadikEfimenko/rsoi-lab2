const request = require("supertest");
var app = require("./index").app;

describe('Login', function() {
    it("checkLogin 404", function(done) {
        request(app)
            .post("/checkLogin")
            .send({})
            .expect(404)
            .end(done);
    });

    it("checkLogin 200 password not ok", function(done) {
        request(app)
            .post("/checkLogin")
            .send({ "login": "login1", "password": "login1"})
            .expect(200)
            .end(done);
    });

    it("checkLogin 200 ok", function(done) {
        request(app)
            .post("/checkLogin")
            .send({ "login": "login1", "password": "login111"})
            .expect(200)
            .end(done);
    });

    it("addLogins 404", function(done) {
        request(app)
            .post("/addLogins")
            .send({})
            .expect(404)
            .end(done);
    });

    it("addLogins 200", function(done) {
        request(app)
            .post("/addLogins")
            .send({
                "logins": {
                    "login4": "login4"
                }
            })
            .expect(200)
            .end(done);
    });

    it("deleteLogins 404", function(done) {
        request(app)
            .post("/deleteLogins")
            .send({})
            .expect(404)
            .end(done);
    });

    it("deleteLogins 200", function(done) {
        request(app)
            .post("/deleteLogins")
            .send({ "logins": [ "login4" ]})
            .expect(200)
            .end(done);
    });
});

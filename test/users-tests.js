
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const should = chai.should();
const assert = chai.assert;

const User = require('../models/user');

chai.use(chaiHttp);

let loginDetails = {
    "username": "TEST",
    "password": "test",
}

let registerDetails = {
    "username": "TEST",
    "password": "test",
    "plate": "B23TEST",
    "phone": "072234234"
};

let testLoginResponse = {
    "user": "USER",
    "token": "token"
}

let token = '';

describe('Create Account, Register, Change password, Delete Account', () => {
    describe('Register account', () => {
        it('should register a new acount in the database', function (done) {
            chai.request(server)
                .post('/auth/register')
                .send(registerDetails)
                .end(function (err, res) {
                    assert.equal(res.text, 'Successfully created new account');
                    res.should.have.status(200);
                    done();
                });
        });
    });

    describe('Log-in account', () => {
        it('should login with the test account', function (done) {
            chai.request(server)
                .post('/auth/login')
                .send(loginDetails)
                .end(function (err, res) {
                    res.body.should.include.keys(["user", "token"]);
                    token = res.body.token;
                    res.should.have.status(200);
                    done();
                });
        });
    });

    describe('Change password', () => {
        it('should let you change password', function (done) {
            chai.request(server)
                .put('/user/changepass')
                .set('Authorization', 'Bearer ' + token)
                .send({ password: "abc" })
                .end(function (err, res) {
                    assert.notEqual(res.text, 'No new password found');
                    res.should.have.status(200);
                    done();
                });
        });
    });

    describe('Update info (plate number)', () => {
        it('should let you update account information', function (done) {
            chai.request(server)
                .put('/user/update')
                .set('Authorization', 'Bearer ' + token)
                .send({ plate: "B22CHANGED" })
                .end(function (err, res) {
                    assert.equal(res.text, 'Succesfully updated');
                    res.should.have.status(200);
                    done();
                });
        });
    });

    describe('Get info by plate number', () => {
        it('should let you search an user by plate number', function (done) {
            chai.request(server)
                .get('/user/plate')
                .set('Authorization', 'Bearer ' + token)
                .send({ plate: "B22CHANGED" })
                .end(function (err, res) {
                    console.log(res.body);
                    res.body.should.include.keys(["username", "plate", "phone", "_id"]);
                    assert.notEqual(res.text, 'Succesfully updated');
                    res.should.have.status(200);
                    done();
                });
        });
    });

    describe('Delete account', () => {
        it('should delete your account', function (done) {
            chai.request(server)
                .delete('/user/delete')
                .set('Authorization', 'Bearer ' + token)
                .end(function (err, res) {
                    assert.equal(res.text, 'Succesfully deleted');
                    res.should.have.status(200);
                    done();
                });
        });
    });
});

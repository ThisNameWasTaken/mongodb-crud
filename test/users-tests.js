
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const should = chai.should();

chai.use(chaiHttp);

let login_details = {
    'email_or_username': 'email@email.com',
    'password': '123@abc'
}

let registerDetails = {
    'email': 'email@email.com',
};

describe('Create Account, Register, Change password, Delete Account', () => {
    describe('Register account', () => {
        it('should register a new acount in the database', function (done) {
            chai.request(server)
                .post('/user/register')
                .send(registerDetails)
                .end(function (err, res) {
                    res.should.have.status(200);
                    //res.text.should.be(registerDetails.email + ' has been registered');
                    done();
                });
        });
    });



    describe('Log-in account', () => {

    });

    describe('Change password', () => {

    });

    describe('Delete account', () => {

    });
});

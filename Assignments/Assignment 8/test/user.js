//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
var userList = [];
var remindersList = [];

chai.use(chaiHttp);
//Our parent block
describe('Users', () => {
    beforeEach((done) => { //Before each test we empty the database
		for(var i = userList.length; i > 0; i--){
			userList.pop();
		}
		done();
    });

    beforeEach((withDummyData) => { //Add dummy data before specific tests
		let user = { user : {
			name: "John Doe",
			email: "test@test.com"
			}
		}
		chai.request(server)
			.post('/users')
			.send(user)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('id');
				userList.push(res.body.id);
				withDummyData();
			});
	});

/*
    afterEach((withDummyData) => { //Add dummy data before specific tests
			chai.request(server)
				.delete('/users/0')
				.end((err, res) => {
					res.should.have.status(204);
					withDummyData();
				});
	});
*/
	/*
	* Test the /GET route
	*/
	describe('/GET/:id users', () => {
		it('it should GET a users by the given id', (withDummyData) => {
			chai.request(server)
				.get('/users/0')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('name');
					res.body.should.have.property('email');
					res.body.name.should.eql('John Doe');
					res.body.email.should.eql('test@test.com');
					withDummyData();
				});
		});
	});

	/*
	* Test the /GET route
	*/
	describe('/GET/:id users', () => {
		it('it should not GET a users by the given id', (done) => {
			chai.request(server)
				.get('/users/999999999999999999')
				.end((err, res) => {
					res.should.have.status(404);
					res.body.should.be.a('object');
					res.body.should.have.property('error');
					res.body.should.have.property('message');
					res.body.error.should.eql(404);
					chai.expect(res.body.message).to.include('User with ID');
					done();
				});
		});
	});

	/*
	* Test the /POST route
	*/
	describe('/POST users', () => {
		it('it should POST a user', (done) => {
			let user = { user : {
				name: "John Doe",
				email: "test@test.com"
				}
			}
			chai.request(server)
				.post('/users')
				.send(user)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('id');
					done();
				});
		});
	});

	/*
	* Test the /POST route
	*/
	describe('/POST users', () => {
		it('it should not POST a user', (done) => {
			let user = {
			}
			chai.request(server)
				.post('/users')
				.send(user)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.be.a('object');
					res.body.should.have.property('error');
					res.body.should.have.property('message');
					res.body.error.should.eql(400);
					res.body.message.should.eql('No data was provided');
					done();
				});
		});
	});

	/*
	* Test the /DELETE/:id route
	*/
	describe('/DELETE/:id users', () => {
		it('it should DELETE a users by the given id', (withDummyData) => {
			chai.request(server)
				.delete('/users/5')
				.end((err, res) => {
					res.should.have.status(204);
					withDummyData();
				});
		});
	});


	/*
	* Test the /DELETE/:id route
	*/
	describe('/DELETE/:id users', () => {
		it('it should not DELETE a users by the given id', (done) => {
			chai.request(server)
				.delete('/users/9999999999')
				.end((err, res) => {
					res.should.have.status(404);
					res.body.should.be.a('object');
					res.body.should.have.property('error');
					res.body.should.have.property('message');
					res.body.error.should.eql(404);
					chai.expect(res.body.message).to.include('User with ID');
					done();
				});
		});
	});
});


describe('Reminders', () => {
    beforeEach((done) => { //Before each test we empty the database
		for(var i = remindersList.length; i > 0; i--){
			remindersList.pop();
		}
		done();
    });

    beforeEach((withDummyData) => { //Add dummy data before specific tests
		let reminder = { reminder : {
				title: "Test Reminder",
				description: "This is a test"
				}
		}
		chai.request(server)
			.post('/users/0/reminders')
			.send(reminder)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('id');
				remindersList.push(res.body.id);
				withDummyData();
			});
	});

/*
    afterEach((withDummyData) => { //Add dummy data before specific tests
			chai.request(server)
				.delete('/users/0')
				.end((err, res) => {
					res.should.have.status(204);
					withDummyData();
				});
	});
*/
	/*
	* Test the /GET route
	*/
	describe('/GET/:id reminders', () => {
		it('it should GET all the user\'s reminders by the given user id', (withDummyData) => {
			chai.request(server)
				.get('/users/0/reminders')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('array');
					(res.body[0]).should.have.all.deep.keys('id', 'title', 'description', 'userID', 'created');
					(res.body[0]).title.should.equal('Test Reminder');
					(res.body[0]).description.should.equal('This is a test');
					withDummyData();
				});
		});
	});

	/*
	* Test the /GET route
	*/
	describe('/GET/:id reminders', () => {
		it('it should GET no reminders for the user by the given user id', (withDummyData) => {
			chai.request(server)
				.get('/users/1/reminders')
				.end((err, res) => {
					res.should.have.status(404);
					res.body.should.be.a('object');
					res.body.should.have.property('error');
					res.body.should.have.property('message');
					res.body.error.should.eql(404);
					chai.expect(res.body.message).to.include('No reminders for user');
					withDummyData();
				});
		});
	});

	/*
	* Test the /GET route
	*/
	describe('/GET/:id reminders', () => {
		it('it should GET all the user\'s reminders with a Title of \'Test Reminder\'', (withDummyData) => {
			chai.request(server)
				.get('/users/0/reminders?title=Test Reminder')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('array');
					(res.body[0]).should.have.all.deep.keys('id', 'title', 'description', 'userID', 'created');
					(res.body[0]).title.should.equal('Test Reminder');
					withDummyData();
				});
		});
	});

	/*
	* Test the /GET route
	*/
	describe('/GET/:id reminders', () => {
		it('it should not GET any reminders with a Title of \'Test Title\' for the user with a given id', (withDummyData) => {
			chai.request(server)
				.get('/users/0/reminders?title=Test Title')
				.end((err, res) => {
					res.should.have.status(404);
					res.body.should.be.a('object');
					res.body.should.have.property('error');
					res.body.should.have.property('message');
					res.body.error.should.eql(404);
					chai.expect(res.body.message).to.include('No reminders with title');
					withDummyData();
				});
		});
	});

	/*
	* Test the /GET route
	*/
	describe('/GET/:id reminders', () => {
		it('it should GET no reminders - user does NOT exist', (withDummyData) => {
			chai.request(server)
				.get('/users/9999999999/reminders')
				.end((err, res) => {
					res.should.have.status(404);
					res.body.should.be.a('object');
					res.body.should.have.property('error');
					res.body.should.have.property('message');
					res.body.error.should.eql(404);
					chai.expect(res.body.message).to.include('User with ID');
					withDummyData();
				});
		});
	});

	/*
	* Test the /GET route
	*/
	describe('/GET/:id reminders', () => {
		it('it should GET a user\'s reminder by the given reminder id', (withDummyData) => {
			chai.request(server)
				.get('/users/0/reminders/0')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.all.deep.keys('title', 'description', 'created');
					res.body.title.should.equal('Test Reminder');
					res.body.description.should.equal('This is a test');
					withDummyData();
				});
		});
	});

	/*
	* Test the /GET route
	*/
	describe('/GET/:id reminders', () => {
		it('it should not GET a user\'s reminder by the given reminder id', (withDummyData) => {
			chai.request(server)
				.get('/users/0/reminders/999999999999')
				.end((err, res) => {
					res.should.have.status(404);
					res.body.should.be.a('object');
					res.body.should.have.property('error');
					res.body.should.have.property('message');
					res.body.error.should.eql(404);
					chai.expect(res.body.message).to.include('No reminder with ID');
					withDummyData();
				});
		});
	});

	/*
	* Test the /GET route
	*/
	describe('/GET/:id reminders', () => {
		it('it should not GET a user\'s reminder by the given reminder id - user does NOT exist', (withDummyData) => {
			chai.request(server)
				.get('/users/999999999999/reminders/999999999999')
				.end((err, res) => {
					res.should.have.status(404);
					res.body.should.be.a('object');
					res.body.should.have.property('error');
					res.body.should.have.property('message');
					res.body.error.should.eql(404);
					chai.expect(res.body.message).to.include('User with ID');
					withDummyData();
				});
		});
	});

	/*
	* Test the /POST route
	*/
	describe('/POST reminders', () => {
		it('it should POST a reminder', (done) => {
			let reminder = { reminder : {
				title: "Test Reminder",
				description: "This is a test"
				}
			}
			chai.request(server)
				.post('/users/0/reminders')
				.send(reminder)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('id');
					done();
				});
		});
	});

	/*
	* Test the /POST route
	*/
	describe('/POST reminders', () => {
		it('it should not POST a reminder for an existing user', (done) => {
			let reminder = {
			}
			chai.request(server)
				.post('/users/0/reminders')
				.send(reminder)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.be.a('object');
					res.body.should.have.property('error');
					res.body.should.have.property('message');
					res.body.error.should.eql(400);
					res.body.message.should.eql('No data was provided');
					done();
				});
		});
	});

	/*
	* Test the /POST route
	*/
	describe('/POST reminders', () => {
		it('it should not POST a reminder - user does NOT exist', (done) => {
			let reminder = { reminder : {
				title: "Test Reminder",
				description: "This is a test"
				}
			}
			chai.request(server)
				.post('/users/999999999/reminders')
				.send(reminder)
				.end((err, res) => {
					res.should.have.status(404);
					res.body.should.be.a('object');
					res.body.should.have.property('error');
					res.body.should.have.property('message');
					res.body.error.should.eql(404);
					chai.expect(res.body.message).to.include('User');
					done();
				});
		});
	});

	/*
	* Test the /DELETE/:id route
	*/
	describe('/DELETE/:id reminders', () => {
		it('it should DELETE a user\'s reminder by the given reminder id', (withDummyData) => {
			chai.request(server)
				.delete('/users/0/reminders/1')
				.end((err, res) => {
					res.should.have.status(204);
					withDummyData();
				});
		});
	});


	/*
	* Test the /DELETE/:id route
	*/
	describe('/DELETE/:id reminders', () => {
		it('it should not DELETE a user\'s reminder by the given reminder id', (withDummyData) => {
			chai.request(server)
				.delete('/users/0/reminders/9999999999')
				.end((err, res) => {
					res.should.have.status(404);
					res.body.should.be.a('object');
					res.body.should.have.property('error');
					res.body.should.have.property('message');
					res.body.error.should.eql(404);
					chai.expect(res.body.message).to.include('No reminder with ID');
					withDummyData();
				});
		});
	});

	/*
	* Test the /DELETE/:id route
	*/
	describe('/DELETE/:id reminders', () => {
		it('it should not DELETE a user\'s reminder by the given reminder id - user does NOT exist', (withDummyData) => {
			chai.request(server)
				.delete('/users/9999999999/reminders/9999999999')
				.end((err, res) => {
					res.should.have.status(404);
					res.body.should.be.a('object');
					res.body.should.have.property('error');
					res.body.should.have.property('message');
					res.body.error.should.eql(404);
					chai.expect(res.body.message).to.include('User with ID');
					withDummyData();
				});
		});
	});

	/*
	* Test the /DELETE/:id route
	*/
	describe('/DELETE/:id reminders', () => {
		it('it should not DELETE a user\'s reminder by the given reminder id - user has NO reminders', (withDummyData) => {
			chai.request(server)
				.delete('/users/1/reminders/9999999999')
				.end((err, res) => {
					res.should.have.status(404);
					res.body.should.be.a('object');
					res.body.should.have.property('error');
					res.body.should.have.property('message');
					res.body.error.should.eql(404);
					chai.expect(res.body.message).to.include('No reminders for user');
					withDummyData();
				});
		});
	});

	/*
	* Test the /DELETE/:id route
	*/
	describe('/DELETE/:id reminders', () => {
		it('it should not DELETE all of the user\'s reminders - user has NO reminders', (withDummyData) => {
			chai.request(server)
				.delete('/users/1/reminders/')
				.end((err, res) => {
					res.should.have.status(404);
					res.body.should.be.a('object');
					res.body.should.have.property('error');
					res.body.should.have.property('message');
					res.body.error.should.eql(404);
					chai.expect(res.body.message).to.include('No reminders for user');
					withDummyData();
				});
		});
	});

	/*
	* Test the /DELETE/:id route
	*/
	describe('/DELETE/:id reminders', () => {
		it('it should not DELETE all of the user\'s reminders - user does NOT exist', (withDummyData) => {
			chai.request(server)
				.delete('/users/9999999999/reminders/')
				.end((err, res) => {
					res.should.have.status(404);
					res.body.should.be.a('object');
					res.body.should.have.property('error');
					res.body.should.have.property('message');
					res.body.error.should.eql(404);
					chai.expect(res.body.message).to.include('User with ID');
					withDummyData();
				});
		});
	});

	/*
	* Test the /DELETE/:id route
	*/
	describe('/DELETE/:id reminders', () => {
		it('it should DELETE all of the user\'s reminders', (withDummyData) => {
			chai.request(server)
				.delete('/users/0/reminders/')
				.end((err, res) => {
					res.should.have.status(204);
					withDummyData();
				});
		});
	});


});
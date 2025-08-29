"use strict";

/* -- Import chai lib -- */
import * as chai from 'chai';

/* -- Import chai-http plugin (pointer) and request function */
import {default as chaihttp, request} from "chai-http";

/* -- Promisify util (see below) -- */
import { promisify } from 'util';

import { getDatabaseInstance } from '../database.js';

import { app } from '../index.js'; // Note: this will start the server itself

/* -- Middleware setup -- */
chai.use(chaihttp);



 /* -- Constants and variables  -- */ 

 /*
 With chai + chai-http middleware, we can define an agent
 acting as a client performing requests on the server object
 and automatically understanding URL + port to contact.
 Chai-http also simplifies the body definition, 
 transmission and automatically parses request/response body
 (fetch could be used as an alternative, but it is more verbose)
 */
let agent = request.execute(app).keepOpen()

let db;

let dbRun, dbAll, dbGet;

const users = [
    {deviceid: 'device1', groupname: 'gruppo1', email: 'gruppo1@gmail.com', password: 'password1234', gender: 'male', height: 1.83, weight: 82.7, age: 25, liftedweight: 20.0, shiftduration: 120},
    {deviceid: 'device2', groupname: 'gruppo2', email: 'gruppo2@gmail.com', password: 'password1234', gender: 'female', height: 1.60, weight: 55.0, age: 33, liftedweight: null, shiftduration: null},
    {deviceid: 'device3', groupname: 'gruppo3', email: 'gruppo3@gmail.com', password: 'password1234', gender: 'other', height: 1.95, weight: 97.0, age: 50, liftedweight: null, shiftduration: null},
];

const data = [
    {acceleration_x: 15.0, acceleration_y: 0.1, acceleration_z: 2.0, gyroscope_x: 12.0, gyroscope_y: 3.0, gyroscope_z: 4.0, compass_x: 5.0, compass_y: 0.2, compass_z: 3.0, heartrate_value: 60, heartrate_isvalid: 1, spoxygen_value: 95, spoxygen_isvalid: 1, temperature: 36.5, timestamp: '2025-04-10T11:15:01Z', altitude: 180.0, latitude: 73.0, longitude: 74.0, deviceid: 'device1'},
    {acceleration_x: 16.0, acceleration_y: 3.1, acceleration_z: 2.0, gyroscope_x: 15.0, gyroscope_y: 3.3, gyroscope_z: 4.1, compass_x: 5.6, compass_y: 2.2, compass_z: 3.0, heartrate_value: 40, heartrate_isvalid: 1, spoxygen_value: 55, spoxygen_isvalid: 0, temperature: 37.5, timestamp: '2025-04-10T11:15:02Z', altitude: 180.2, latitude: 73.0, longitude: 74.0, deviceid: 'device1'},
    {acceleration_x: 16.0, acceleration_y: 3.1, acceleration_z: 2.0, gyroscope_x: 15.0, gyroscope_y: 3.3, gyroscope_z: 4.1, compass_x: 5.6, compass_y: 2.2, compass_z: 3.0, heartrate_value: 120, heartrate_isvalid: 0, spoxygen_value: 95, spoxygen_isvalid: 1, temperature: 36.5, timestamp: '2025-04-10T11:15:03Z', altitude: 180.3, latitude: 73.0, longitude: 74.2, deviceid: 'device1'},
]; 

async function insertUsers(users) {
    for (const user of users) {
        const sql = 'INSERT OR REPLACE INTO user (deviceid, groupname, email, password, gender, height, weight, age, liftedweight, shiftduration) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        await dbRun(sql, [user.deviceid, user.groupname, user.email, user.password, user.gender, user.height, user.weight, user.age, user.liftedweight, user.shiftduration])
    }
}

async function insertData(data) {
    for (const dataitem of data) {
        const sql = 'INSERT OR REPLACE INTO data (acceleration_x, acceleration_y, acceleration_z, gyroscope_x, gyroscope_y, gyroscope_z, compass_x, compass_y, compass_z, heartrate_value, heartrate_isvalid, spoxygen_value, spoxygen_isvalid, temperature, timestamp, altitude, latitude, longitude, deviceid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        await dbRun(sql, [dataitem.acceleration_x, dataitem.acceleration_y, dataitem.acceleration_z, dataitem.gyroscope_x, dataitem.gyroscope_y, dataitem.gyroscope_z, dataitem.compass_x, dataitem.compass_y, dataitem.compass_z, dataitem.heartrate_value, dataitem.heartrate_isvalid, dataitem.spoxygen_value, dataitem.spoxygen_isvalid, dataitem.temperature, dataitem.timestamp, dataitem.altitude, dataitem.latitude, dataitem.longitude, dataitem.deviceid])
    }
}

async function clearDb() {
    const sql1 = 'DELETE FROM data';
    const sql2 = 'DELETE FROM user';
    await dbRun(sql1);
    await dbRun(sql2);
}

/* -- To be executed once upfront -- */

before(async () => {
    try {
        db = await getDatabaseInstance();
        /* 
            Promisify util:
            allows to call db operations really in a synchronous way in order
            to grant the correct ordering of the beforeach operations with respect
            to eachother and to the tests to be executed
        */
        dbGet = promisify(db.get).bind(db);
        dbAll = promisify(db.all).bind(db);
        dbRun = promisify(db.run).bind(db);

    }
    catch (err) {
        console.log(err)
        throw (err)   // stop test
    }
});


/* -- To be executed before every test -- */
beforeEach(async () => {
    try {
        await clearDb();
        await insertUsers(users);
        await insertData(data);
    }
    catch(err)
    {
        console.log(err)
        throw (err) // stop test
    }
    
})


/* -- Tests -- */
describe('Test 1: GET /users', () => {
    it('200 - returns list of data', async () => {

        const res = await agent.get('/API/users')
        const body = res.body;

        chai.expect(res.status).to.equal(200);
        chai.expect(body).to.have.lengthOf(3);
        chai.expect(body[0].deviceid).to.equal(users[0].deviceid);
        chai.expect(body[1].deviceid).to.equal(users[1].deviceid);
        chai.expect(body[2].deviceid).to.equal(users[2].deviceid);
    })
})

describe('Test 2: POST /login', () => {
    it('200 - returns user information', async () => {

        const userToLogin = users[0];
        const credentials = {email: userToLogin.email, password: userToLogin.password}
        const res = await agent.post('/API/login').send(credentials);
        const body = res.body;

        chai.expect(res.status).to.equal(200);
        chai.expect(body.deviceid).to.equal(userToLogin.deviceid);
        chai.expect(body.groupname).to.equal(userToLogin.groupname);
        chai.expect(body.gender).to.equal(userToLogin.gender);
        chai.expect(body.height).to.equal(userToLogin.height);
        chai.expect(body.weight).to.equal(userToLogin.weight);
        chai.expect(body.age).to.equal(userToLogin.age);
        chai.expect(body.liftedweight).to.equal(userToLogin.liftedweight);
        chai.expect(body.shiftduration).to.equal(userToLogin.shiftduration);
    })

    it('403 - wrong email', async () => {
        const credentials = {email: "wrongemail@example.com", password: "password1234"}
        const res = await agent.post('/API/login').send(credentials);
        chai.expect(res.status).to.equal(403);
    })

    it('403 - wrong password', async () => {
        // you continue :)!
    })

    it('403 - empty email', async () => {
        // you continue :)!
    })

    it('403 - empty password', async () => {
        // you continue :)!
    })

    it('403 - empty contents', async () => {
        // you continue :)!
    })

    it('403 - wrong body', async () => {
        // you continue :)!
    })
})

/* 
Now it's your turn to add further testcases, testing all the APIs, 
including various as many request combinations as possible and testing all the possible responses! 
Remember: 
1) Test as many things as you can
2) The good test isn't the one which returns a positive response, but the one that finds a failure!
*/
'use strict'

/* -- Dependencies -- */
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import service from './service.js'; // Note: this import also starts the database connection

/* -- Not mandatory middlewares -- */
import { body, validationResult } from 'express-validator';


/* -- WEBSERVER AND MIDDLEWARE CONFIGURATION -- */

/* Express server init */
const app = new express();
const port = 3001;

/* 
   CORS options allowing access to specific browser client
   Remember what CORS means: in case your client is running on another port,
   this needs to be setup here
*/
const corsOptions = {
    origin: 'http://localhost:3000'
    //credentials: true
};

/* Middlewares */
app.use(express.json());
app.use(morgan('dev'));
app.use(cors(corsOptions));


/* -- API controllers  -- */

/* Validation Rules */

/* *** example *** 
const team = ['grifondoro', 'serpeverde', 'tassorosso', 'corvonero'];
const studentDTOValidationRules = [
    body('colors').exists().notEmpty().withMessage('This field is mandatory')
        .isIn(team).withMessage('Invalid color value'),
    body('name').exists().notEmpty().withMessage('This field is mandatory')
]; 
***

*/

/* API Endpoints */

/* *** GET API example ***

/* app.get('/API/students/:id', async (req, res) => {
    try {
        // Get student ID from URI param
        const studentId = req.params.id;

        // call service to retrieve the student from db
        const student = await service.getStudent(studentId);

        // no student found -> error 404
        if (!student) {
            return res.status(404).json({ error: `No data found for student ID ${studentId}` });
        }

        // otherwise return 200 + student in body (JSON)
        return res.status(200).json(student);
    }
    catch(err) {
        // If exception caught -> return 500 (serverside error)
        return res.status(500).json({error: err})
    }
}) */

/* *** POST API example ***

app.post('/API/students', studentDTOValidationRules, async (req, res) => {
    try {
        // validate body before proceeding in calling service
        const errors = validationResult(req);

        // if the body validation fails, return 400 (bad request)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Get student from request body
        const student = req.body

        // call service to post student in db
        const result = await service.postStudent(student)

        // if everything ok -> return 201 (created)
        return res.status(201).end()
    }

    catch(err){
        // If exception caught -> return 500 (serverside error)
        return res.status(500).json({error: err})
    }
}) */


/* -- webserver startup -- */
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
});



/* -- MQTT CLIENT CONFIGURATION -- */

/* Variables and Constants */
import mqtt from 'mqtt';
var clientId = 'clientmqtt_' + Math.random().toString(16).substr(2,8);

/* Define below the topics to subscribe */
// const studentTopic = 'studentTopic/??'

/* 
Default MQTT Connect params - 
feel free to change if you think about better solutions ;) 
*/
var options = {
    keepalive: 30,
    clientId: clientId,
    clean: true,
    reconnectPeriod: 1000,
    connectTimeout: 30*1000,
    will: {
        topic: 'WillMsg',
        payload: 'Backend client: connection closed abnormally!',
        qos: 0,
        retain: false
    },
    rejectUnauthorized: false
};


/* -- MQTT connect -- */
// tcp://...:1884 to use MQTT over TCP (classic MQTT used for IoT)
var host = 'tcp://127.0.0.1:1884'; // alternative: ws://127.0.0.1:8080 to use MQTT over websocket as transport (used in webclients)
var client = mqtt.connect(host, options);


/* -- MQTT events management -- */

/* Hint: some methods that an MQTT client can use: 
    subscribe(topicName: String), 
    unsubscribe(topicName: String),
    publish(topic: String, message: String, options: Object)
*/

// Callback: error
client.on('error', function (err) {
    console.log('MQTT error event detected: ', err);
    client.end();
});

// Callback: connect completed
client.on('connect', function () {
    console.log('MQTT client connected: ', clientId);

    try {
         // What do you think it is required to be done upon connection?
         // Hint: do you need to do anything with topics?
    }
    catch (e) {
        console.log('onConnect caught exception: ', e);
    }

});

// Callback: message received
client.on('message', async (topic, message) => {
    try {

        // You should parse the JSON message and handle it
        // Hint: do you know you can get the message content but also the sender? What do you have to do with it?
        // Hint: what would you do with the message content? Is there anything to check?
        // Hint: are there cases in which you should "publish" some kind of message too?
    }

    catch (e) {
        console.log("onMessage caught exception: ", e);
    }
})

// Callback: client disconnected
client.on('close', function () {
    console.log('MQTT client disconnected');
    try {
        // What do you think it is required to be done upon disconnection?
        // Hint: do you need to do anything with topics?
    }
    catch (e) {
        console.log('onClose caught exception: ', e)
    }
})

export {
    app,
}
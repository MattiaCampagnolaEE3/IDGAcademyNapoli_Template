'use strict'

/* -- Dependencies -- */
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const service = require('./service');

/* -- Not mandatory middlewares -- */
const { body, validationResult } = require('express-validator');


/* -- WEBSERVER AND MIDDLEWARE CONFIGURATION -- */

/* Express server init */
const app = new express();
const port = 3001;

/* CORS options allowing access to specific browser client */
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
const genderValues = ['male', 'female', 'other'];
const putApiUsersValidationRules = [
    body('groupname').exists().notEmpty().withMessage('This field is mandatory'),
    body('gender').exists().notEmpty().withMessage('This field is mandatory')
        .isIn(genderValues).withMessage('Invalid gender value'),
    body('height').exists().notEmpty().withMessage('This field is mandatory')
        .isFloat().withMessage('Wrong field type'),
    body('weight').exists().notEmpty().withMessage('This field is mandatory')
        .isFloat().withMessage('Wrong field type'),
    body('age').exists().notEmpty().withMessage('This field is mandatory')
        .isInt().withMessage('Wrong field type'),
];


/* API Endpoints */

app.get('/API/data/:id', async (req, res) => {
    try {
        const deviceId = req.params.id;
        const data = await service.getData(deviceId);

        if (!data) {
            return res.status(404).json({ error: `No data found for device ID ${deviceId}` });
        }

        return res.status(200).json(data);
    }
    catch(err) {
        
        return res.status(500).json({error: err})
    }
})

app.get('/API/users', async (req, res) => {
    try {
        const users = await service.getUsers();

        if (!users || users.length === 0) {
            return res.status(404).json({ error: "No users found "});
        }

        return res.status(200).json(users);
    }
    catch(err) {
        return res.status(500).json({error: err})
    }
})

app.put('/API/users/:deviceId', putApiUsersValidationRules, async (req, res) => {
    const deviceId = req.params.deviceId;
    const content = req.body;
    
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        const result = await service.updateUserByDeviceId(deviceId, content);

        if (result.updatedRows === 0) {
            return res.status(404).json({ error: 'No changes made'});
        }

        res.status(200).json({deviceId, ...content});
    } catch (error) {
        if (error.message === 'Device not found') {
            return res.status(404).json({error: `Device Id ${deviceId} not found`});
        }
        res.status(500).json({error: error.message});
    }
});

/* -- webserver startup -- */
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
});



/* -- MQTT CLIENT CONFIGURATION -- */

/* Variables and Constants */
var mqtt = require('mqtt');
var clientId = 'clientmqtt_' + Math.random().toString(16).substr(2,8);
const dataTopic = 'data/#'
const alertTopic = 'alert/#';

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


/* -- MQTT connection -- */
// tcp://...:1884 to use MQTT over TCP (classic MQTT used for IoT)
var host = 'tcp://127.0.0.1:1884'; // alternative: ws://127.0.0.1:8080 to use MQTT over websocket as transport (used in webclients)
var client = mqtt.connect(host, options);


/* -- MQTT events management -- */
client.on('error', function (err) {
    console.log('MQTT error event detected: ', err);
    client.end();
});

client.on('connect', function () {
    console.log('MQTT client connected: ', clientId);

    try {
        console.log('subscribing topics\n' + dataTopic + '\n' + alertTopic);
        client.subscribe(dataTopic);
        client.subscribe(alertTopic);
    }
    catch (e) {
        console.log('onConnect caught exception: ', e);
    }

});

client.on('message', async (topic, message) => {
    try {
        // Parsing message
        var parsedMessage = JSON.parse(message);
        
        
        // Data messages
        if (topic.startsWith('data')) {
            console.log("Received MQTT message in topic: " + topic +"\nMessage:\n" + message.toString());
            // save data to DB
            console.log('Saving data into DB...');
            const id = await service.saveDataToDatabase(parsedMessage);
            console.log('Data stored in the database: ', id);

            // Alert detection
            const alert = await service.detectAlert(parsedMessage);
            if (alert) {
                client.publish('alert/' + topic.split("/")[1], JSON.stringify(alert), { q0s: 0, retain: false});
                console.log('Alert sent');
            } 
        } else if (topic.startsWith('alert')) {
            console.log("Received MQTT message in topic: " + topic);
        }


    }

    catch (e) {
        console.log("onMessage caught exception: ", e);
    }
})

client.on('close', function () {
    console.log(clientId + ' disconnected');
    try {
        console.log('unsubscribing topics\n' + dataTopic + '\n' + alertTopic);
        client.unsubscribe(dataTopic)
        client.unsubscribe(alertTopic)
    }
    catch (e) {
        console.log('onClose caught exception: ', e)
    }
})
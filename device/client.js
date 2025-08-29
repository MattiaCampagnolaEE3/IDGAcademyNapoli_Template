const deviceId = 'device1';
const dataTopic = 'data/' + deviceId;
const alertTopic = 'alert/' + deviceId;

/* -- MQTT connection -- */

var mqtt = require('mqtt');
var clientId = 'clientmqtt_' + Math.random().toString(16).substr(2,8);
var options = {
    keepalive: 30,
    clientId: clientId,
    clean: true,
    reconnectPeriod: 1000,
    connectTimeout: 30*1000,
    will: {
        topic: 'WillMsg',
        payload: 'Device: connection closed abnormally!',
        qos: 0,
        retain: false
    },
    rejectUnauthorized: false
};

/* -- tcp://...:1884 to use MQTT over TCP (classic MQTT used for IoT) -- */
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
        console.log('subscribing topic ', alertTopic);
        client.subscribe(alertTopic);
    }
    catch (e) {
        console.log('onConnect caught exception: ', e);
    }

});

client.on('message', (topic, message) => {

    try {
        // Parsing message
        var parsedMessage = JSON.parse(message);
        
        if (topic.startsWith("alert")) {
            console.log("Received alert from device", topic.split("/")[1], ": \n", parsedMessage);
        }
    }

    catch (e) {
        console.log("onMessage caught exception: ", e);
    }
})

client.on('close', function () {
    console.log(clientId + ' disconnected');
    try {
        console.log('unsubscribing topic ', alertTopic);
        client.unsubscribe(alertTopic)
    }
    catch (e) {
        console.log('onClose caught exception: ', e)
    }
})


/** -- Data simulation -- */
function getRandomFloat(min, max, decimals = 2) {
	return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateSensorData() {
	const now = new Date();

	const data = {
		acceleration: {
			ax: getRandomFloat(-10, 10),
			ay: getRandomFloat(-10, 10),
			az: getRandomFloat(-10, 10),
		},
		gyroscope: {
			gx: getRandomFloat(-500, 500),
			gy: getRandomFloat(-500, 500),
			gz: getRandomFloat(-500, 500),
		},
		compass: {
			cx: getRandomFloat(-50, 50),
			cy: getRandomFloat(-50, 50),
			cz: getRandomFloat(-50, 50),
		},
		heartrate: {
			value: getRandomInt(50, 180),
            isValid: Math.random() < 0.95 ? 1 : 0, // 95%  valid
		},
		spoxygen: {
			value: getRandomInt(90, 100),
            isValid: Math.random() < 0.95 ? 1 : 0, // 95%  valid
		},
		temperature: getRandomFloat(34.0, 40.0, 1),
		timestamp: now.toISOString(),
		coordinates: {
			altitude: getRandomFloat(0, 500),
			latitude: getRandomFloat(45.0, 46.0, 6),
			longitude: getRandomFloat(7.0, 8.0, 6),
		},
	};

	return data;
}

// Esegui ogni 6 secondi
setInterval(() => {
	const sensorData = generateSensorData();
	console.log(JSON.stringify(sensorData));
    
    try {
        client.publish(dataTopic, JSON.stringify(sensorData), { qos: 0, retain: false});
        
    }
    catch (e) {
        console.log('Error while publishing message: ', e);
    }
}, 6000);
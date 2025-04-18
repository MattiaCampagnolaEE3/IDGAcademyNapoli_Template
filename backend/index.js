'use strict'

/* -- Dependencies -- */
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const service = require('./service');


/* -- SERVER AND MIDDLEWARE CONFIGURATION -- */

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

app.put('/API/users/:deviceId', async (req, res) => {
    const deviceId = req.params.deviceId;
    const content = req.body;

    // check all values are filled
    const requiredFields = ['groupname', 'gender', 'height', 'weight', 'age'];
    const missingFields = requiredFields.filter(field => !(field in content));

    if (missingFields.length > 0) {
        return res.status(400).json({
            error: `Missing required fields: ${missingFields.join(', ')}`
        });
    }

    // check gender is female, male or other
    const acceptedGenders = ['male', 'female', 'other'];
    if(!acceptedGenders.includes(content.gender)) {
        return res.status(400).json({
            error: `${content.gender} is invalid. Accepted values for gender: ${acceptedGenders.join(', ')}`
        });
    }

    try {
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
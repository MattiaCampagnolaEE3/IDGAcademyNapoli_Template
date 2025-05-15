'use strict'

/* Imports */

const {getDatabaseInstance} = require("./database")

/* Singleton database instance access */
let db;
getDatabaseInstance()
    .then(dbinstance => db = dbinstance)
    .catch(err => console.error(err));

/* -- Services -- */

function login(credentials){
    return new Promise((resolve, reject) => {
        const sql = 'SELECT COUNT(*) AS count FROM USER WHERE email = ? AND password = ?';
        db.get(sql, [credentials.email, credentials.password], (err, row) => {
            
            if (err) {
                reject(err);
            }
            
           return resolve(row.count)
        });
    });
}

function getData(deviceid){
    return new Promise((resolve, reject) => {

        const sql = 'SELECT * FROM data WHERE deviceid = ?';
        db.all(sql, [deviceid], (err, rows) => {

            if (err) {
                reject(err);
            }
            
            if (!rows || rows.length === 0) {
                // DeviceID not found or has no data
                return resolve(null);
            }

            else {
                const data = rows.map(data => (
                    {
                        acceleration: {
                            ax: data.acceleration_x,
                            ay: data.acceleration_y,
                            az: data.acceleration_z
                        },

                        gyroscope: {
                            gx: data.gyroscope_x,
                            gy: data.gyroscope_y,
                            gz: data.gyroscope_z
                        },

                        compass: {
                            cx: data.compass_x,
                            cy: data.compass_y,
                            cz: data.compass_z
                        },

                        heartrate: {
                            value: data.heartrate_value,
                            isValid: data.heartrate_isvalid
                        },

                        spoxygen: {
                            value: data.spoxygen_value,
                            isValid: data.spoxygen_isvalid
                        },

                        temperature: data.temperature,
                        timestamp: data.timestamp,

                        coordinates: {
                            altitude: data.altitude,
                            latitude: data.latitude,
                            longitude: data.longitude
                        }
                    })
                );    
                resolve(data);
            }
        });
    });
}

function getUsers(){
    return new Promise((resolve, reject) => {

        const sql = 'SELECT deviceid FROM user';
        db.all(sql, [], (err, rows) => {

            if (err) {
                reject(err);
            }

            if (!rows || rows.length === 0) {
                return resolve(null);
            }

            else {
                const users = rows;
                resolve (users);
            }
        });
    });
}

function updateUserByDeviceId(deviceId, content) {
    return new Promise((resolve, reject) => {

        // check deviceId already exists
        const checkSql = 'SELECT * FROM user WHERE deviceID = ?';
        db.get(checkSql, [deviceId], (err, row) => {
            if (err) return reject(err);

            if (!row) {
                return reject(new Error(`Device not found`));
            }

        })
        
        const updateSql = `
            UPDATE user SET 
                groupname = ?,
                email = ?,
                password = ?,
                gender = ?,
                height = ?,
                weight = ?,
                age = ?,
                liftedweight = ?,
                shiftduration = ?
            WHERE deviceId = ?
        `;

        const values = [
            content.groupname,
            content.email,
            content.password,
            content.gender,
            content.height,
            content.weight,
            content.age,
            content.liftedweight || null,
            content.shiftduration || null,
            deviceId
        ];
        
        db.run(updateSql, values, function (err) {
            if(err) {
                return reject(err);
            }

            resolve({ updatedRows: this.changes });
        });
    });
}

// Alert detection - implementation for heartrate 
function detectAlert(data) {
    return new Promise((resolve, reject) => {
        try {
            const hrValue = data.heartrate?.value;
            const hrValid = data.heartrate?.isValid;

            if (hrValid === 0) {
                console.log('Invalid heartrate data');
                return resolve(null);
            }

            if (hrValue < 60 || hrValue > 100) {
                console.log('Heartrate out of range. Sending alert..');
                return resolve({
                    message: 'Your parameters are out of range!',
                    parameter: ['heartrate'],
                    heartrate: hrValue
                });
            }

            resolve(null); 
        } catch (e) {
            console.log('Error in alert: ', e);
            reject(e); 
        }
    });
}

// Save data to database
function saveDataToDatabase(dataToSave) {
    return new Promise((resolve, reject) => {
        const insertQuery = `
            INSERT INTO data ( 
                acceleration_x, 
                acceleration_y, 
                acceleration_z, 
                gyroscope_x, 
                gyroscope_y, 
                gyroscope_z, 
                compass_x,
                compass_y,
                compass_z,
                heartrate_value,
                heartrate_isvalid,
                spoxygen_value,
                spoxygen_isvalid,
                temperature,
                timestamp,
                altitude,
                latitude,
                longitude,
                deviceid)
            VALUES (
                ?, ?, ?,
                ?, ?, ?,
                ?, ?, ?,
                ?, ?,
                ?, ?,
                ?,
                ?,
                ?, ?, ?,
                ?
                )
        `;

        const data_values = [
            dataToSave.acceleration?.ax,
            dataToSave.acceleration?.ay,
            dataToSave.acceleration?.az,
            dataToSave.gyroscope?.gx,
            dataToSave.gyroscope?.gy,
            dataToSave.gyroscope?.gz,
            dataToSave.compass?.cx,
            dataToSave.compass?.cy,
            dataToSave.compass?.cz,
            dataToSave.heartrate?.value,
            dataToSave.heartrate?.isValid,
            dataToSave.spoxygen?.value,
            dataToSave.spoxygen?.isValid,
            dataToSave.temperature,
            dataToSave.timestamp,
            dataToSave.coordinates?.altitude,
            dataToSave.coordinates?.latitude,
            dataToSave.coordinates?.longitude,
            'device1'
        ];

        db.run(insertQuery, data_values, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
}

module.exports = {
    login,
    getData, 
    getUsers,
    updateUserByDeviceId,
    detectAlert,
    saveDataToDatabase
};
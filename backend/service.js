'use strict'

/* Imports */

const {getDatabaseInstance} = require("./database")

/* Singleton database instance access */
let db;
getDatabaseInstance()
    .then(dbinstance => db = dbinstance)
    .catch(err => console.error(err));

/* -- Services -- */

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

module.exports = {
    getData, 
    getUsers,
    updateUserByDeviceId
};
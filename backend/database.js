const sqlite = require('sqlite3');

/* -- Database instance opening (singleton) -- */
let db = null;

async function getDatabaseInstance() {
    return new Promise((resolve, reject) => {
        if (!db){
            db = new sqlite.Database('database.sqlite', (err) => {
            
                /* Errors while creating / instantiating the database */
                if (err){
                    console.error('Error while creating the database:', err);
                    reject(err);
                }
        
                /* Database tables definition */
                else {
                    const createDataTable = `CREATE TABLE IF NOT EXISTS data (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            acceleration_x REAL,
                            acceleration_y REAL,
                            acceleration_z REAL,
                            gyroscope_x REAL,
                            gyroscope_y REAL,
                            gyroscope_z REAL,
                            compass_x REAL,
                            compass_y REAL,
                            compass_z REAL,
                            heartrate_value INTEGER,
                            heartrate_isvalid INTEGER,
                            spoxygen_value INTEGER,
                            spoxygen_isvalid INTEGER,
                            temperature REAL,
                            timestamp TEXT,
                            altitude REAL,
                            latitude REAL,
                            longitude REAL,
                            deviceid TEXT,
                            FOREIGN KEY (deviceid) REFERENCES user(deviceid)
                        );`;
        
                    const createUserTable = `CREATE TABLE IF NOT EXISTS user (
                            deviceid TEXT PRIMARY KEY,
                            groupname TEXT,
                            email TEXT,
                            password TEXT,
                            gender TEXT,
                            height REAL,
                            weight REAL,
                            age INTEGER,
                            liftedweight FLOAT,
                            shiftduration INTEGER
                        );`;
        
                    db.run(createUserTable, (err) => {
                        if (err) {
                            console.error('Error while creating table data:', err.message);
                        } else {
                            console.log('Table data is ok.');
                        }
                    });
        
                    db.run(createDataTable, (err) => {
                        if (err) {
                            console.error('Error while creating table users:', err.message);
                        } else {
                            console.log('Table users is ok.');
                        }
                    });
                }
            });
        }
        resolve(db);
    });   
};

module.exports = {getDatabaseInstance}
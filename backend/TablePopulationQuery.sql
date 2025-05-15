-- SQLite
CREATE TABLE IF NOT EXISTS user (
                deviceid TEXT PRIMARY KEY,
                groupname TEXT,
                gender TEXT,
                height REAL,
                weight REAL,
                age INTEGER,
                liftedweight FLOAT,
                shiftduration INTEGER);

CREATE TABLE IF NOT EXISTS data (
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
                FOREIGN KEY (deviceid) REFERENCES user(deviceid));


INSERT INTO user (deviceid, groupname, email, password, gender, height, weight, age, liftedweight, shiftduration) 
VALUES ('device1', 'gruppo1', 'gruppo1@gmail.com', 'password1234', 'male', 1.83, 82.7, 25, 20.0, 120);

INSERT INTO user (deviceid, groupname, email, password, gender, height, weight, age, liftedweight, shiftduration) 
VALUES ('device2', 'gruppo2', 'gruppo2@gmail.com', 'password1234', 'female', 1.60, 55.0, 33, null, null);

INSERT INTO user (deviceid, groupname, email, password, gender, height, weight, age, liftedweight, shiftduration) 
VALUES ('device3', 'gruppo3', 'gruppo3@gmail.com', 'password1234', 'other', 1.95, 97.0, 50, null, null);


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
VALUES(
    15.0, 0.1, 2.0,
    12.0, 3.0, 4.0,
    5.0, 0.2, 3.0,
    60, 1,
    95, 1,
    36.5,
    '2025-04-10T11:15:01Z',
    180.0, 73.0, 74.0,
    'device1');

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
VALUES(
    16.0, 3.1, 2.0,
    15.0, 3.3, 4.1,
    5.6, 2.2, 3.0,
    40, 1,
    55, 0,
    37.5,
    '2025-04-10T11:15:02Z',
    180.2, 73.0, 74.0,
    'device1');

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
VALUES(
    16.0, 3.1, 2.0,
    15.0, 3.3, 4.1,
    5.6, 2.2, 3.0,
    120, 0,
    95, 1,
    36.5,
    '2025-04-10T11:15:03Z',
    180.3, 73.0, 74.2,
    'device1');
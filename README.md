# IDG Academy Napoli -> Backend

## Needed tools:
* install nodejs
* install vscode
* install some useful vscode plugins from vscode extensions:
  * SQLite: database viewer and querier
  * REST Client: easy way to test APIs with a .http file 

## Populate the database with some example content:
* Ensure SQLite extension plugin was installed on vscode
* Open TablePopulationQuery.sql
* Right click + run query
  
## Start the server:
* open project folder in vscode
* for the first time only open a vscode terminal (cmd) on the proj. folder and type
  * npm init
  * npm install (it will automatically install all the packages already present in package_json)
* to start the server, open a vscode terminal (cmd) on the proj. folder and type
  * node index.js

## Test APIs in an easy way via Rest Client:
* Ensure Rest Client extension plugin was installed on vscode
* Start the server
* Open APISimpleTest.http
* Define requests (GET/POST/PUT/DELETE...)
* Click on 'send request'

## Mosquitto:
* Download eclipse mosquitto x64 from web and install it (requires admin level)
* DO NOT open mosquitto.exe manually, see below
* Inside the project, copy the path in which there's the 'mosquitto.conf' file (ex. ./Mosquitto Configurations/Windows/mosquitto.conf)
* To startup a broker instance
  * Open a windows terminal (cmd) in mosquitto's folder (ex. C:\Programfiles\mosquitto)
  * use command: mosquitto.exe -c "<mosquitto.conf file path>" -v
* To stop the broker process, press ctrl+c

### Port is already in use error
This means an instance is already running --> to close it, admin privileges are needed
* Closing the process is the first option
* 2nd option is to go into the configuration file and change the listening port of the broker



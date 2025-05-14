# IDG Academy Napoli -> Backend

## Tools installation:
Install the following tools:
* install nodejs
* install vscode
* install some useful vscode plugins from vscode extensions:
  * SQLite: database viewer and querier
  * REST Client: easy way to test APIs with a .http file

## Clone the repository
First, on your local machine, create the folder where you will save your local repository. <br>
Then, in the main page of the Bitbucket repository click on "Clone" (upper part of the page, at your right).
Select the option "Clone in VS Code" and allow the site to open Visual Studio Code, a pop up window should appear. Tick the box to give the approval and then click on "Open". <br>
Visual Studio Code should open and you need to allow for the opening of the URI. Click on "Open" in the pop up window that shows up.<br>
Select "Clone new copy", choose the folder you have created at the first step and click on "Select as repository destination".<br>
After a few seconds, you should see the repository copied and opened in your Visual Studio Code. In the Explorer of VSCode (upper left hand-side panel), you should see the following structure:

![Project folder structure](pictures/project_folder_structure.png)


## First set up
Before running the software, for the first time **only**, you need to install all the required packages to ensure proper execution. Follow these steps:<br>
* In the project folder in VSCode, open a new terminal (cmd)
* Navigate to the backend folder by typing
  ```bash
  cd backend
  ```
* Type npm init
* Type npm install
* In a few seconds all packages present in *package_json* file will be automatically installed
* Repeat this procedure for the device folder too. Open a new terminal (cmd)
* Navigate to the device folder by typing 
  ```bash
  cd device
  ```
* Type npm init
* Type npm install
* In a few seconds all packages present in *package_json* file will be automatically installed

## Populate the database with some example content:
The code you are provided with, there are some examples of queries that you can use to create the tables and populate them with some sample data.

In the panel at the left hand side of VSCode, you should see a tab for SQLITE EXPLORER, like this: 

![SQLite Extension](pictures/sqlite_extension.png)

If this is not the case, then click on the folder *backend*, right click on *database.sqlite* and click on *Open Database*. Now you should see the SQLITE EXPLORER tab. 

Once you have verifies that the SQLite extension plugin was installed on VSCode, you can proceed with the population of the database. <br>
* Open backend/TablePopulationQuery.sql
* Right click and select run query (if a top down menu appears in the search bar, select the first option)

Check that the database was populated <br>
* Right click on *database.sqlite* and select *Open Database*
* In the SQLITE EXPLORER you should see two tables (user and data)
  ![Database content](pictures/database_content.png)
* Click on the play icon to see the content of the table

CONTINUARE DA QUA 

## Start the server: (FIRST PART ALREADY DONE)
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



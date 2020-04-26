# Blockly Studio
Visual End-User Programming Workspace Environment for development and learning. The Blockly Studio is able to host domains of end-user programming such as the Personal automations in the Internet of Things, Web Pages applications, Mobile Applications, LoGo etc.
Domain authors are able to design the application domain in the context of:

1. Project Manager
  * define project structure and the project item types
  * define all possible actions
  * define the style
2. Project Items
  * define the UI template
  * define the editor config sources are included
  * define domain elements are exported
  * define Blockly (and Rete) elements will be constructed during the development time
    (depends the domain elements will be developed. E.g. button will be designed means 
     blockly blocks to handle it).
3. Run-time Console
  * define the script for run-time purposes (implementing the interfaces for run-time scripts)
  * define extra run-time views (e.g. view area of monitoring smart objects)

- Build and run the project:

1. Install MongoDB, python 2.7, latest npm and node
2. Start DB: .\mongod.exe --dbpath="path of the DB/data" #default port is 27017
3. npm install #in the folder includes webpack
4. Run server: cd ./src/app/ide/backend/ & node --inspect server.js # default port is 3031
5. webpack --watch # deafult port is 8080
6. choose index.html from the list of sources will be presented on webpage will open automatically in the browser


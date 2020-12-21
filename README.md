# Blockly Studio

Visual End-User Programming Workspace Environment for development and learning. The Blockly Studio is able to host domains of end-user programming such as the Personal automations in the Internet of Things, Web Pages applications, Mobile Applications, LoGo etc.
Domain authors are able to design the application domain in the context of:

1. Project Manager

- define project structure and the project item types
- define all possible actions
- define the style

2. Project Items

- define the UI template
- define the editor config sources are included
- define domain elements are exported
- define Blockly (and Rete) elements will be constructed during the development time
  (depends the domain elements will be developed. E.g. button will be designed means
  blockly blocks to handle it).

3. Run-time Console

- define the script for run-time purposes (implementing the interfaces for run-time scripts)
- define extra run-time views (e.g. view area of monitoring smart objects)


# How to build and run the project:

0. git clone --recurse-submodules url_path_blocklystudio_repo
1. Install MongoDB (3.6.21), python 2.7, latest npm and node
2. Set up the environment variables for mongo and python
3. npm install
3. python git_pull_update.py
4. Download and put the BlocklyStudioDB in the git folder
5. python start.py
6. when browser opens, choose index.html

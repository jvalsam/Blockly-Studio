##
# Pull, Update and Build third party repositories of the Blockly Studio
#
# Yannis Valsamakis <jvalsam@ics.forth.gr>
# November 2020
##

import os
import sys


print(sys.version)
os.system('git pull')

print('\nPull Submodules of Blockly Studio\n')
os.system('git submodule update')
os.system('git submodule foreach git checkout master')
os.system('git submodule foreach git pull origin master')

print('\nAutomatic IoT User Interfaces:\n')
AutomaticIoTInterfacesPath = './domains-libs/IoT/AutoIoTGen/iot-interfaces/'
os.chdir(AutomaticIoTInterfacesPath)

if (not os.path.isdir('./node_modules')):
    os.system('npm i')

os.system('npm run library')

print('\nBlockly Visual Debugger:\n')

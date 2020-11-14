import sys
import datetime
import os


print(sys.version)

print('Start MongoDB...')

os.system('start cmd.exe /c mongod --dbpath=.\BlocklyStudioDB\MongoDB\data')

os.system('timeout 5 >nul')

print('Start Blockly Studio Backend...')

os.chdir('./src/app/ide/backend/')
os.system('start cmd.exe /c node --inspect server.js')

print('Start Blockly Studio Frontend...')
os.system('npm run build')

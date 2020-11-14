import sys
import datetime
import os


print(sys.version)

print('Download DB')

# download wget
# os.system('start cmd.exe /c powershell -command "Invoke-WebRequest -uri "https://eternallybored.org/misc/wget/1.20.3/64/wget.exe" -outfile "wget.exe" -UseBasicParsing"')
# download DB
# os.system('start cmd.exe /c powershell -command "wget.exe path" tar.exe -xf "AACs_AlwW9uBq7qL3r3UNqHGa@dl=0"')
# unzip DB


print('Start MongoDB...')

os.system('start cmd.exe /c mongod --dbpath=.\BlocklyStudioDB\MongoDB\data')

os.system('timeout 5 >nul')

print('Start Blockly Studio Backend...')

os.chdir('./src/app/ide/backend/')
os.system('start cmd.exe /c node --inspect server.js')

print('Start Blockly Studio Frontend...')
os.system('npm run build')

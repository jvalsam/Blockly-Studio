#!/usr/bin/python
import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import sys
import os
import datetime
import shutil


print ('Starts Building...')
from cg_components import FindDecoratorComponentName

exceptionPath = './src/app\ide\components-framework\components-bridge.ts'

def BuildTemplates():
    print ('Starts Administering templates...')
    templatesPath = "./templates"
    templatesList = []
    for root, dirs, files in os.walk(templatesPath):
        templatesList.extend(files)
    for root, dirs, files in os.walk("./src"):
        for file in files:
            if file.endswith(".html"):
                templateFileName = '___' + FindDecoratorComponentName(root + '/') + '_name_' + file
                dst = templatesPath + '/' + templateFileName
                src = root + '/' + file
                if templateFileName not in templatesList:
                    with open(dst,"a+") as f:
                        f.close()
                        shutil.copy2 (src, dst)
                        print ('Copy: ' + src + ' to ' + dst)
                elif os.stat(src).st_mtime - os.stat(dst).st_mtime > 1:
                    with open(dst,"a+") as f:
                        f.close()
                        shutil.copy2 (src, dst)
                        templatesList.remove(templateFileName)
                        print ('Update: ' + src + ' to ' + dst)
                else:
                    templatesList.remove(templateFileName)
    for name in templatesList:
        filePath = templatesPath + '/' + name
        os.remove(filePath)
        print ('Remove: ' + filePath)
    print ('Ends Administering templates...')

BuildTemplates()
os.system('webpack')

# TODO: collect events in time stack, and pop it every 2 seconds
class MyHandler(FileSystemEventHandler):
    eventData = [False]

    def handle(self, event):
        if event.src_path == exceptionPath:
            return
        print ('Starts Building...')
        os.system("py cg_components.py")
        BuildTemplates()
        os.system('webpack')

    def check_evt_stack(self):
        if self.eventData[0] == True:
            self.handle(self.eventData[1])
            self.eventData[0] = False
            self.eventData[1] = None

    def on_modified(self, event):
        self.eventData = [True, event]

event_handler = MyHandler()
observer = Observer()
observer.schedule(event_handler, path='./src/', recursive=True)
observer.start()

try:
    while True:
        time.sleep(1)
        event_handler.check_evt_stack()
except KeyboardInterrupt:
    observer.stop()
observer.join()
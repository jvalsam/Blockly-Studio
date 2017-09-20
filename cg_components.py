##
# Parse folder path of components and generate source code
# the instantiation of the components - Components.ts
#
# Yannis Valsamakis <jvalsam@ics.forth.gr>
# August 2017
##

import datetime
import os
from os import listdir
from os.path import isfile, join

print('Starts Components Bridge Codegeneration...')

ProjectPath = './src/app/ide/'

DecoratorsComponentsList = [
    '@UIComponentMetadata', '@UIComponentMetadata(', '@UIComponentMetadata({',
    '@ComponentMetadata', '@ComponentMetadata(', '@ComponentMetadata({',
    '@ViewMetadata', '@ViewMetadata(', '@ViewMetadata({'
]

def FindComponentName(compPath):
    flag = 0
    filePathList = [f for f in listdir(compPath) if isfile(join(compPath, f))]
    for filePath in filePathList:
        f = open(compPath + '/' + filePath)
        words = f.read().split()
        for i in range(len(words)):
            if words[i] in DecoratorsComponentsList:
                flag = 1
            if words[i] == 'extends' and flag == 1:
                return [words[i-1], filePath]
        f.close()
    return []


def FindName(filePath):
    flag = 0
    f = open(filePath)
    words = f.read().split()
    for i in range(len(words)):
        if words[i] in DecoratorsComponentsList:
            flag = 1
        if flag == 1 and words[i] == 'name':
            word = words[i+2].replace(",", "").replace('"', "").replace("'", "")
            f.close()
            return word
        if flag == 1 and words[i] == 'name:':
            word = words[i+1].replace(",", "").replace('"', "").replace("'", "")
            f.close()
            return word
    f.close()
    return ''

def FindDecoratorComponentName(compPath):
    filePathList = [f for f in listdir(compPath) if isfile(join(compPath, f))]
    for filePath in filePathList:
        name = FindName(compPath + filePath)
        if name != '':
            return name
    return ''


file = open(ProjectPath + "components-framework/component/components-bridge.ts","w")

file.write("/**\n")
file.write(" * -- Auto generated --\n")
file.write(" * Components - Instantiation of the Components of IDE\n")
file.write(" *\n")
file.write(" * Yannis Valsamakis <jvalsam@ics.forth.gr>\n")
file.write(" * " + str(datetime.datetime.now()) + "\n")
file.write(" */\n\n")

# find path folders of component to import them in IDE

ComponentNameList = []

for root, dirs, files in os.walk('./src/'):
    data = FindComponentName(root)
    if len(data) == 0:
        continue;
    ComponentNameList.append(data[0])
    file.write("import { " + data[0] + " } from \"../../../../." + root.replace('\\','/') + "/" + data[1][:-3] + "\";\n")

file.write("\n\nexport class ComponentsBridge {\n")
file.write("\tpublic static initialize(): void {\n")

for componentName in ComponentNameList:
    file.write("\t\t" + componentName + ".onInit();\n")

file.write("\t}\n\n")

file.write("}\n")

file.close()

print('Ends Components Bridge Codegeneration')

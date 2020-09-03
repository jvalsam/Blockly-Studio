##
# Parse folder path of components and generate source code
# the instantiation of the components - Components.ts
#
# Yannis Valsamakis <jvalsam@ics.forth.gr>
# August 2017
##

import sys
import datetime
import os
from os import listdir
from os.path import isfile, join

import urllib2

print(sys.version)

print('Starts Components Bridge Codegeneration...')

ProjectPath = './src/app/ide/'

DecoratorsComponentsList = [
    '@PlatformEditorMetadata', '@PlatformEditorMetadata(', '@PlatformEditorMetadata({',
    '@UIComponentMetadata', '@UIComponentMetadata(', '@UIComponentMetadata({',
    '@ComponentMetadata', '@ComponentMetadata(', '@ComponentMetadata({',
    '@ViewMetadata', '@ViewMetadata(', '@ViewMetadata({',
    '@ComponentViewMetadata', '@ComponentViewMetadata(', '@ComponentViewMetadata({',
    '@ComponentViewElementMetadata', '@ComponentViewElementMetadata(', '@ComponentViewElementMetadata({'
]

def FindComponentNames(compPath):
    filePathList = [f for f in listdir(compPath) if isfile(join(compPath, f))]
    for filePath in filePathList:
        f = open(compPath + '/' + filePath)
        words = f.read().split()
        flag = 0
        for i in range(len(words)):
            if words[i] in DecoratorsComponentsList:
                flag = 1
            if words[i] == 'extends' and flag == 1:
                data = [words[i-1], filePath]
                print (data[0] + " is registered.")
                if data[0] != "IDEErrorView" and data[0] != "IDEWarningView" and data[0] != "IDEUIComponent" and data[0] != "Editor":
                    ComponentNameList.append(data[0])
                    file.write("import { " + data[0] + " } from \"../../../../." + root.replace('\\','/') + "/" + data[1][:-3] + "\";\n")
                break
        f.close()


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

file.write("import { IDEUIComponent } from \"../../../../../src/app/ide/components-framework/component/ide-ui-component\";\nimport { Editor } from \"../../../../../src/app/ide/components-framework/build-in.components/editor-manager/editor\";\n\nimport { IDEErrorView } from \"../../../../../src/app/ide/shared/ide-error/ide-error-view\";\nimport { IDEWarningView } from \"../../../../../src/app/ide/shared/ide-error/ide-warning-view\";\n\n")

for root, dirs, files in os.walk('./src/'):
    if "media" in root:
        continue
    data = FindComponentNames(root)

file.write("\n\nexport class ComponentsBridge {\n")
file.write("\tpublic static initialize(): void {\n\t\tIDEUIComponent.onInit();\n\t\tEditor.onInit();\n\t\tIDEErrorView.onInit();\n\t\tIDEWarningView.onInit();")

for componentName in ComponentNameList:
    file.write("\t\t" + componentName + ".onInit();\n")

file.write("\t}\n\n")

file.write("}\n")

file.close()

print('Ends Components Bridge Codegeneration')


def downloadFile(URL, dstPath):
    response = urllib2.urlopen(URL)
    data = response.read()
    file_ = open(dstPath, 'w')
    file_.write(data)
    file_.close()
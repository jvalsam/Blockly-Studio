import sys
import datetime
import os
from os import listdir
from os.path import isfile, join

import urllib2


print(sys.version)

print('Starts Domains Bridge Code Generation.')

DomainsPath = './src/app/application-domain-frameworks/'
DomainsConfVPL = "./domains-vpl-conf/"

os.chdir(DomainsPath)

# create domains.js file
file = open("domains.ts","w")

file.write("/**\n")
file.write(" * -- Auto generated --\n")
file.write(" * Domains Loader - Instantiation for the Application Domains of IDE\n")
file.write(" *\n")
file.write(" * Yannis Valsamakis <jvalsam@ics.forth.gr>\n")
file.write(" * " + str(datetime.datetime.now()) + "\n")
file.write(" */\n\n")

os.chdir(DomainsConfVPL)

Domains = os.listdir("./")

for domain in Domains:
    file.write("import {\n")
    file.write("    InitializeVPDL as Initialize" + domain + "VPDL\n")
    file.write("} from \"" + DomainsConfVPL + domain + "/vpdl/domain\";\n")

file.write("\nvar ProjectManagerMetaData = { };\n")
for domain in Domains:
    file.write("ProjectManagerMetaData['" + domain + "'] = require('" + DomainsConfVPL + domain + "/project-manager/application-structure" + ".json')\n")

file.write("\nexport function InitializeVPDLs() {\n")

for domain in Domains:    
    file.write("    Initialize" + domain + "VPDL();\n")

file.write("}\n\n")

print('Domains Bridge Code Generation Completed.')
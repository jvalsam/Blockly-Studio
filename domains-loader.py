import sys
import datetime
import os
from os import listdir
from os.path import isfile, join

import urllib2


print(sys.version)

print('Starts Domains Bridge Code Generation.')

DomainsPath = './src/app/ide/domains/'


# create domains.js file
file = open("domains.ts","w")

file.write("/**\n")
file.write(" * -- Auto generated --\n")
file.write(" * Domains Loader - Instantiation for the Application Domains of IDE\n")
file.write(" *\n")
file.write(" * Yannis Valsamakis <jvalsam@ics.forth.gr>\n")
file.write(" * " + str(datetime.datetime.now()) + "\n")
file.write(" */\n\n")

file.write("import {\n")
file.write("    InitializeVPDL as InitializeIoTVPDL\n")
file.write("} from \"./src/app/ide/domains/IoT/vpdl/iot-domain\";\n")
file.write("import {\n")
file.write("    InitializeVPDL as InitializeSimpleDomainVPDL\n")
file.write("} from \"./src/app/ide/domains/SimpleTasks/vpdl/simple-domain\";\n\n")

file.write("export function InitializeVPDLs() {\n")
file.write("    InitializeIoTVPDL();\n")
file.write("    InitializeSimpleDomainVPDL();\n")
file.write("}\n\n")

os.chdir(DomainsPath)

Domains = os.listdir("./")

for domain in Domains:
    print(domain)

print('Domains Bridge Code Generation Completed.')
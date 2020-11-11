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
file = open("domains-initialization.ts","w")

file.write("/**\n")
file.write(" * -- Auto generated --\n")
file.write(" * Domains Initialization for the Application Domains of IDE\n")
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


file.write("\nexport function InitializeVPDLs() {\n")

for domain in Domains:    
    file.write("    Initialize" + domain + "VPDL();\n")
file.write("}\n\n")

file.close()

os.chdir("../")

# Generate domain holder file

file = open("domains-holder.ts","w")

file.write("/**\n")
file.write(" * -- Auto generated --\n")
file.write(" * Domains Holder for the Application Domains Information and Project Manager of IDE\n")
file.write(" *\n")
file.write(" * Yannis Valsamakis <jvalsam@ics.forth.gr>\n")
file.write(" * " + str(datetime.datetime.now()) + "\n")
file.write(" */\n\n")
file.write("\nvar ProjectManagerMetaData;\n")
file.write("var ApplicationDomainFrameworks;\n\n")

file.write("export function InitializeDomainsHolder() {\n")
file.write("    ProjectManagerMetaData = [];\n")
file.write("    ApplicationDomainFrameworks = [];\n\n")
for domain in Domains:
    file.write("    ProjectManagerMetaData.push( require('" + DomainsConfVPL + domain + "/project/application-structure" + ".json') );\n")
    file.write("    ApplicationDomainFrameworks.push( require('" + DomainsConfVPL + domain + "/project/domain-info" + ".json') );\n")

file.write("}\n\n")

file.write("\nexport function GetProjectManagerMetaData(domain) {\n")
file.write("    return ProjectManagerMetaData[domain];\n")
file.write("}\n\n")

file.write("export function GetAllProjectManagerMetaData() {\n")
file.write("    return ProjectManagerMetaData;\n")
file.write("}\n")

file.write("\nexport function GetApplicationDomainFrameworks() {\n")
file.write("    return ApplicationDomainFrameworks;\n")
file.write("}\n\n")

file.close()

print('Domains Bridge Code Generation Completed.')
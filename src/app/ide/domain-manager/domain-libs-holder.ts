/**
 * Auto-generated
 */


 export class DomainLibsHolder {
     private static libs: { [libName: string]: any };
     public static initialize(): void {
        this.libs = {};
        //TODO: DB request and load for the existing libs
     }

     public static load (src) {
         //this.libs[src.name] = require(src.path);
         $.getScript(src.url, function(data) {
            this.libs[src.name] = data;
         });
     }

     public static call (libName, funcName, args) {
         //TODO: develop library loading runtime
         //this.libs[libName][funcName] (...args);
         return null;
     }
 }

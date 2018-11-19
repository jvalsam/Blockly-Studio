var mongoose = require('mongoose');
var _ = require('lodash');

var WSPDomainStyleSchema = new mongoose.Schema({
    name: { type: String, required: [ true, "domain name not exists" ] },
    supportedDomains: [ String ], //TODO: check it is valid domain name...
    title: {},
    project: {
        title: {},
        categories: {},
        items: {}
    }
});
  
module.exports = mongoose.model('WSPDomainStyle', WSPDomainStyleSchema, 'WSPStyles');
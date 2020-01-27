var mongoose = require('mongoose');

var VEUPDomainSourceDescriptionSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: [ true, "Visual end-user programming source description name not exists" ] },
    description: { type: String, required: [ true, "domain title not exists" ] },
    img: { path: String, fa: String },
    vpeditors: [ String ],
    vpelements: [ { type: mongoose.Schema.Types.ObjectId, ref: "VEUPDomainElementDescription" } ],
    data: {}
});

module.exports = mongoose.model('VEUPDomainSourceDescription', VEUPDomainSourceDescriptionSchema, 'DescriptionVEPDomainSources');
var mongoose = require('mongoose');

var VEUPDomainElementDescriptionSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: [ true, "Visual end-user programming source description name not exists" ] },
    description: { type: String, required: [ true, "domain title not exists" ] },
    img: { path: String, fa: String },
    data: [
        {
            editor: { type: Object.Schema.ObjectId, ref: "" },
            visual: {},
            codeGen: String,
            construction: {
                importedName: String,
                script: String
            }
        }
    ],
    export: {}
});

module.exports = mongoose.model('VEUPDomainElementDescription', VEUPDomainElementDescriptionSchema, 'DescriptionVEPDomainElements');
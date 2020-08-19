var mongoose = require('mongoose');

var VisualEditorSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: [ true, "Visual editor name not exists" ] },
    description: { type: String, required: [ true, "domain title not exists" ] },
    img: { path: String, fa: String },
    data: {}
});

module.exports = mongoose.model('VisualEditor', VisualEditorSchema, 'VisualEditors');
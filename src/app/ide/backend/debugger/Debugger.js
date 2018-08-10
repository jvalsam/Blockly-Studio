var mongoose = require('mongoose');

var DebuggerSchema = new mongoose.Schema({
    systemID: {type: String, unique: true, required: [true, 'application_id not exist']},            // Blockly_instance id
    breakpoints: [{
        block_id: {type: String, unique: true, required: [true, 'block_id not exist']},
        enabled: {type: Boolean, default: true}
    }],
    created: { type: Date, required: [true, 'created not exist'] },
    lastModified: { type: Date, required: [true, 'lastModified not exist'] }
 });

 module.exports = mongoose.model('Debugger', DebuggerSchema, 'Debuggers');
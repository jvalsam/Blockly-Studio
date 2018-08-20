var mongoose = require('mongoose');
var _ = require('lodash');


// type: { type: String, required: [true, 'category element type not exist'] }
// title: { type: String, required: [true, 'category element title not exist'] },
// img: { data: Buffer, contentType: String, fa: String },
// id: { type: String, required: [true, 'categories.elements.children.id not exist'] },

var WSPDomainEvent = new mongoose.Schema({
    type: { type: String, required: [true, "event type element in action not exists"] },
    action: { type: String, required: [true, "event action element in action not exists"] },
    mission: { type: String, required: [true, "event mission element in action not exists"] }
});

var WSPDomainAction = new mongoose.Schema({
    title: { type: String, required: [true, 'action title element not exists'] },
    img: { data: Buffer, contentType: String, fa: String },
    help: { type: String },
    events: [ WSPDomainEvent ]
});

var WSPDomainMenu = new mongoose.Schema({
    title: { type: String, required: [true, 'menu title element not exists'] },
    img: { data: Buffer, contentType: String, fa: String },
    event: WSPDomainEvent
});

var WSPDomainRenderPart = new mongoose.Schema({
    type: { type: String, required: [ true, "type in renderParts not exists" ] },
    value: {
        retrieve: {
            //     library: { type: String, required: [ true, "library in retrieve of render parts is missing" ] },
            //     function: { type: String, required: [ true, "function in retrieve of render parts is missing" ] },
            //     args: [],
            //     required: false
        },
        default: {
            
        }
    }
});

var WSPDomainItem = new mongoose.Schema({
    type: { type: String, required: [ true, "type of category is missing" ] },
    renderParts: [ WSPDomainRenderPart ],
    menu: [ WSPDomainMenu ],
    validChildren: [ String ],
    events: [ WSPDomainEvent ]
});

var WSPDomainCategory = new mongoose.Schema({
    type: { type: String, required: [ true, "type of category is missing" ] },
    renderParts: [ WSPDomainRenderPart ],
    actions: [ WSPDomainAction ],
    validChildren: [ String ],
    categories: [ this ],
    items: [ WSPDomainItem ]
});

var WSPDomainSchema = new mongoose.Schema({
    domain: { type: String, required: [ true, "domain name not exists" ] },
    title: { type: String, required: [ true, "domain title not exists" ] },
    img: { data: Buffer, contentType: String, fa: String },
    defaultInstImg: { data: Buffer, contentType: String, fa: String },
    actions: [ WSPDomainAction ],
    project: {
        actions: [ WSPDomainAction ],
        categories: [ WSPDomainCategory ]
    }
});
  
module.exports = mongoose.model('WSPDomain', WSPDomainSchema, 'DescriptionWSPMDomains');
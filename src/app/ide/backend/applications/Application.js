var mongoose = require('mongoose');
var Domain = require('../domains/Domain');
var _ = require('lodash');

var CategoryElementSchema = new mongoose.Schema({}, {_id: false});
CategoryElementSchema.add({
    type: { type: String, required: [true, 'category element type not exist'] },
    title: { type: String, required: [true, 'category element title not exist'] },
    img: { data: Buffer, contentType: String, fa: String },
    id: { type: String, required: [true, 'categories.elements.children.id not exist'] },
    innerdata: [],
    children: [ this ]
});

var ElementSchema = new mongoose.Schema({}, {_id: false});
ElementSchema.add({
    type: { type: String, required: [true, 'project element type not exist'] },
    systemID: { type: String, required: [true, 'project element systemID not exist'] },
    orderNO: { type: Number, required: [true, 'project element type not exist'] },
    path: { type: String, required: [true, 'project element systemID not exist'] },
    editorData: { },
    renderParts: [
        {
            type: { type: String, required: [true, 'project renderParts type not exist'] },
            value: {}
        }
    ]
});

var ApplicationSchema = new mongoose.Schema({
    title: { type: String, unique: true, required: [ (value) => value && value.length >= 1, "Title of application cannot be empty" ] },
    author: {
        id: { type: String, required: [true, 'author.id not exist'] },
        username: { type: String, required: [true, 'author.username not exist'] }
    },
    systemIDs: { type: Number, required: [true, "systemIDs is missing"] },
    img: { data: Buffer, contentType: String, fa: String },
    description: { type: String },
    domainType: { type: String, required: [true, 'domainType not exist'] },
    created: { type: Date, required: [true, 'created not exist'] },
    lastModified: { type: Date, required: [true, 'lastModified not exist'] },
    elements: [ ElementSchema ]
});

function checkImgContent (img) {
    return (img.data && img.contentType) || img.fa;
}
function checkCategoryElement (element) {
    if(!checkImgContent(element.img)) {
        return false;
    }
    _.forEach(element.children, (child) => {
        if (!checkImgContent(child.img) || !checkCategoryElement(child))
            return false;
    });
    return true;
}

ApplicationSchema.pre("save", function (next) {
    var self = this;
    _.forEach(self.categories, (category) => {
        _.forEach(category.elements, (element) => {
            if (!checkCategoryElement(element)) {
                self.invalidate("Element Img", "element image of " + element.title + " is not valid.");
                next(new Error("Element image is not valid in application with name "+self.name));
            }
        });
    });
    Domain.findOne({ name: self.domainType }, 'name', function (err, results) {
        if (err) {
            next(err);
        }
        else if (!results) {
            self.invalidate("domainType", "domainType "+self.domainType+" must exist in the Domain documents");
            next(new Error("domainType must exist in Domains documents"));
        }
        else {
            next();
        }
    });
});
ApplicationSchema.statics.fixFilesData = function (schema, files) {
    console.log('FixFilesData for the Applications: Not implemented yet!');
    // TODO: complete it when post respective request in the front-end
    // if (files && files.img) {
    //     schema.img.data = fs.readFileSync(files.img.path);
    //     schema.img.contentType = files.img.type;
    // }
};
module.exports = mongoose.model('Application', ApplicationSchema, 'Applications');
var mongoose = require('mongoose');
var User = require('../user/User');
var DomainSchema = new mongoose.Schema(
    {
        name: { type: String, unique: true, required: [true, "domain name not exist"] },
        title: { type: String, unique: true, required: [true, "domain title not exist"] },
        help: { type: String },
        description: { type: String },
        img: { data: Buffer, contentType: String, fa: String },
        author: {
            id: { type: String, required: [true, 'author.id not exist'] },
            name: { type: String, required: [true, 'author.username not exist'] }
        },
        actions: [String]
    }
);

DomainSchema.pre('save', function (next) {
    var self = this;
    
    User.findById(self.author.id, function (err, user) {
        if (err) {
            self.invalidate("author", "User with id " + self.author.id + " must exist in the User documents to define it in the new Domain");
            next(new Error("There was a DB problem finding the user."));
        }
        else if (!user) {
            self.invalidate("author", "User with id " + self.author.id + " must exist in the User documents to define it in the new Domain");
            next(new Error("Defined author with id " + self.author.id + " not found in users."));
        }
        else {
            next();
        }
    });
});

module.exports = mongoose.model('Domain', DomainSchema, 'Domains');
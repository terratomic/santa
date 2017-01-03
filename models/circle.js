var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;


// setup e-mail data with unicode symbols
var circleSchema = new Schema({
    names: String,
    emails: String,
    pairings: String
});

module.exports = mongoose.model('Circle', circleSchema);

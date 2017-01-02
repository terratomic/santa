var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;


// setup e-mail data with unicode symbols
var emailSchema = new Schema{
    from: String, // sender address
    to: String, // list of receivers
    subject: 'Here\'s your Secret Santa!', // Subject line
    text: String, // plaintext body
    html: String // html body
};

module.exports = mongoose.model('Email', emailSchema);

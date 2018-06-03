var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ShareDataSchema = new Schema({
    availableTo: {
        toUserType: String,  // all, student, teacher
        toGroup: String,
        toUser: String
    },
    data: [],
    dataIds: String
}, { collection: 'shareData'});

var ShareData = mongoose.model('ShareData', ShareDataSchema);

module.exports = ShareData;

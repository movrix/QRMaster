var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ShareDataSchema = new Schema({
    availableTo: {
        toUserType: boolean,  // true - to student, false - to teacher
        toGroup: String,
        toUser: String
    },
    dataIds: []
});

var ShareData = mongoose.model('ShareData', ShareDataSchema);

module.exports = ShareData;

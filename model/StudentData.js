var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StudentDataSchema = new Schema({
    studentId: String,
    title: String,
    passDate: Date,
    results: [],
    mark: String
}, { collection: 'studentData'} );

var StudentData = mongoose.model('StudentData', StudentDataSchema);

module.exports = StudentData;


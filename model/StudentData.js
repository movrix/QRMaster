var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StudentDataSchema = new Schema({
    studentId: String,
    groupId: String,
    title: String,
    passDate: Date,
    results: [],
    mark: String
});

var StudentData = mongoose.model('StudentData', StudentDataSchema);

module.exports = StudentData;


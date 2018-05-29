var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ResultSchema = new Schema({
    studentId: String,
    title: String,
    passDate: Date,
    results: [],
    mark: String
});

var Result = mongoose.model('result', ResultSchema);

module.exports = Result;


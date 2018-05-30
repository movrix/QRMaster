var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TeacherDataSchema = new Schema({
    teacherId: String,
    title: String,
    data: String
});

var TeacherData = mongoose.model('TeacherData', TeacherDataSchema);

module.exports = TeacherData;


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var InvitationDataSchema = new Schema({
    code: String
}, { collection: 'invitationData'});

var InvitationData = mongoose.model('InvitationData', InvitationDataSchema);

module.exports = InvitationData;

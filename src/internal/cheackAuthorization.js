module.exports = {
    isGuest: function () {
        User.find({'_id': req.session.userId}, function (err, results) {
            return (results.length === 0);
        });
    },
    isStudent: function () {
        User.find({'_id': req.session.userId, 'teacher': false}, function (err, results) {
            return (results.length === 1);
        });
    },
    isTeacher: function () {
        User.find({'_id': req.session.userId, 'teacher': true}, function (err, results) {
            return (results.length === 1);
        });
    },
    getUserName: function () {
        User.find({'_id': req.session.userId}, function (err, results) {
            return (results[0]._doc.username);
        });
    }
  };
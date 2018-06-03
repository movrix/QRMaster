var express = require('express');
var app = express();


// Используемые библиотеки
var bodyParser = require('body-parser');  // Чтение тела запроса
var mongoose = require('mongoose');   // Доступ к базе данных
var cors = require('cors');
var path = require('path');
var url = require('url');
var session = require('express-session');  // Создание сессии пользователя
var StudentData = require('./model/StudentData');
var ShareData = require('./model/ShareData');
var InvitationData = require('./model/InvitationData');
var TeacherData = require('./model/TeacherData');
var User = require('./model/User');
var cookieParser = require('cookie-parser');  // Чтенение кук

var router = express.Router();

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: false
}));

var port = process.env.PORT || 8080;        // set our port

var dbUrl = 'mongodb://localhost/results';

if (process.env.OPENSHIFT_MONGODB_DB_URL) {
    dbUrl = process.env.OPENSHIFT_MONGODB_DB_URL
}

// Коннект к базе
mongoose.connect(dbUrl, function (err) {
    if (err) {
        console.log(dbUrl);
        console.log(err);
    } else {
        console.log('Connected');
    }
});

// По обращению к адресам возвращаем html документы и js страницы

// JS

app.get('/js/config.js', function (req, res) {
    res.sendFile(path.join(__dirname + '/resources/config.js'));
});

app.get('/js/lib/qrcode.js', function (req, res) {
    res.sendFile(path.join(__dirname + '/src/js/lib/qrcode.js'));
});

app.get('/js/loadResults.js', function (req, res) {
    res.sendFile(path.join(__dirname + '/src/js/actions/loadResults.js'));
});

app.get('/js/loadTeacherData.js', function (req, res) {
    res.sendFile(path.join(__dirname + '/src/js/actions/loadTeacherData.js'));
});

app.get('/js/loadCurses.js', function (req, res) {
    res.sendFile(path.join(__dirname + '/src/js/actions/loadCurses.js'));
});

app.get('/js/generateQrCode.js', function (req, res) {
    res.sendFile(path.join(__dirname + '/src/js/actions/generateQrCode.js'));
});

app.get('/js/login.js', function (req, res) {
    res.sendFile(path.join(__dirname + '/src/js/actions/login.js'));
});

app.get('/js/utils.js', function (req, res) {
    res.sendFile(path.join(__dirname + '/src/js/utils/utils.js'));
});

app.get('/js/loadShareT.js', function (req, res) {
    res.sendFile(path.join(__dirname + '/src/js/actions/loadShareT.js'));
});

app.get('/js/loadShareS.js', function (req, res) {
    res.sendFile(path.join(__dirname + '/src/js/actions/loadShareS.js'));
});

app.get('/accessAlert', function (req, res) {
    res.sendFile(path.join(__dirname + '/src/accessAlert.html'));
});



// HTML

app.get('/registration', function (req, res) {
    res.sendFile(path.join(__dirname + '/src/register.html'));
});

app.get('/course', function (req, res) {
    res.sendFile(path.join(__dirname + '/src/course.html'));
});

app.get('/share_page_t', function (req, res) {
    User.find({'_id': req.session.userId, 'teacher': true}, function (err, results) {
        if (results.length === 0) {
            res.redirect('/accessAlert');
        } else {
            res.sendFile(path.join(__dirname + '/src/share_page_t.html'));
        }
    });
});

app.get('/share_page', function (req, res) {
    res.sendFile(path.join(__dirname + '/src/share_page.html'));
});

app.get('/login', function (req, res) {
    res.sendFile(path.join(__dirname + '/src/login.html'));
});


// Запрос главной страницы, если это залогиненый студент, то перенаправляем его на результаты, в противном случае
// перенаправляем на логин
app.get('/', function (req, res) {
    User.find({'_id': req.session.userId}, function (err, results) {
        if (results.length !== 1) {
            res.redirect('/login');
        } else if (results[0]._doc.teacher === true) {
            res.sendFile(path.join(__dirname + '/src/teacherData.html'));
        } else {
            res.sendFile(path.join(__dirname + '/src/userData.html'));
        }
    });
});

// Регистрация нового пользователя
app.post('/register', function (req, res) {

    if (req.body.username &&
        req.body.password &&
        req.body.name &&
        req.body.surname &&
        req.body.isTeacher &&
        req.body.ivitation) {

        InvitationData.find({'code': req.body.ivitation}, function (err, results) {
            if (results.length !== 1) {
                res.status(400);
                res.send('Пользователь не создан');
            }
        });
        var userData = {
            username: req.body.username,
            password: req.body.password,
            name: req.body.name,
            surname: req.body.surname,
            group: req.body.grp,
            teacher: req.body.isTeacher === "Преподаватель"
        };
        User.create(userData, function (err, user) {
            if (err) {
                res.send('Пользователь не создан');
                res.status(400);
            } else {
                InvitationData.find({ code:req.body.ivitation }).remove().exec();
                res.status(201);
                res.send();
            }
        });
    }
});

// Вход пользователя
app.post('/api/login', function (req, res) {
    User.authenticate(req.body.username, req.body.password, function (error, user) {
        if (error || !user) {
            res.status(400);
            res.send('Wrong username or password');
        } else {
            req.session.userId = user._id;
            res.status(200);
            res.send();
        }
    });
});

app.get('/api/username', function (req, res) {
    User.find({'_id': req.session.userId}, function (err, results) {
        if (results.length > 0) {
            res.send(results[0]._doc.username);
        } else {
            res.send("Гость");
        }
    });
});

app.get('/api/accountType', function (req, res) {
    User.find({'_id': req.session.userId, 'teacher': false}, function (err, results) {
        res.send("Student");
    });
    User.find({'_id': req.session.userId, 'teacher': true}, function (err, results) {
        res.send("Teacher");
    });
});




app.get('/api/logout', function (req, res, next) {
    if (req.session) {
        // delete session object
        req.session.destroy(function (err) {
            if (err) {
                return next(err);
            } else {
                return res.redirect('/');
            }
        });
    }
});


// Запрос данных в формате json
app.get('/api/userdata', function (req, res) {


    User.findOne({'_id': req.session.userId, 'teacher': false}, function (err, results) {
        if (results != null) {
            StudentData.find({'studentId': req.session.userId}, function (err, data) {
                if (err)
                    res.send(err);
                res.json(data);
            }).select('-results');
        }
    });

    User.findOne({'_id': req.session.userId, 'teacher': true}, function (err, results) {

        if (results != null) {
            TeacherData.find({'teacherId': req.session.userId}, function (err, results) {
                if (err)
                    res.send(err);
                res.json(results);
            });
        }
    });

});


app.get('/shareT', function (req, res) {
    var ids = req.cookies.qrData;

    StudentData.find({_id: {$in: ids}}, function (err, results) {
        res.json(results);
    });
});

app.get('/shareS', function (req, res) {
    /*var data = req.cookies.qrData;

    res.status(301);
    res.redirect(data);*/

    //TeacherData.find({_id: {$in: ids}}, function (err, results) {
    //});
});

app.get('/share/:id', function (req, res) {

    var shareDataId = req.params.id;

    ShareData.find({'_id': shareDataId}, function (err, results) {

        if (results.length !== 1) {
            // записи нет, вернуть ошибку
        }

        if (results[0].availableTo.toUserType === "student") {

            User.find({'_id': req.session.userId, 'teacher': false}, function (err, user) {

                if (user.length === 1) {

                    if (results[0].availableTo.toGroup === user[0].group ||
                        results[0].availableTo.toUser === user[0].username ||
                        (results[0].availableTo.toGroup === null && results[0].availableTo.toUser === null)) {
                        res.cookie('qrData', results[0].data, { maxAge: 900000, httpOnly: true });
                        res.redirect('/shareS');
                    } else {
                        res.redirect('/accessAlert');
                    }
                } else {
                    res.redirect('/accessAlert');
                }
            });
        } else if (results[0].availableTo.toUserType === "teacher") {
            User.find({'_id': req.session.userId, 'teacher': true}, function (err, user) {
                if (user.length === 1) {
                    res.cookie('qrData', results[0].dataIds, { maxAge: 900000, httpOnly: true });
                    res.redirect('/share_page_t');
                } else {
                    res.redirect('/accessAlert');
                }
            });
        } else {
            res.cookie('qrData', results[0].data[0], { maxAge: 900000, httpOnly: true });
            res.redirect('/shareS');
        }

        if (results[0]._doc.toUserType === "all") {
            res.json(results);
        }
    });

});



app.get('/makeshare', function (req, res) {

    var queryData = url.parse(req.url, true).query;

    User.find({'_id': req.session.userId, 'teacher': false}, function (err, results) {
        if (results.length === 1) {

            var shareDataS = {
                availableTo : {
                    toUserType: "teacher",
                    toGroup: null,
                    toUser: null
                },
                dataIds: queryData.id
            };
            ShareData.create(shareDataS, function (err, shareData) {
                if (err) {
                    res.status(400);
                } else {
                    res.send(shareData._id);
                }
            });

        } else {

            var shareDataT = {
                availableTo : {
                    toUserType: queryData.toUserType,
                    toGroup: queryData.toGroup,
                    toUser: queryData.toUser
                },
                data: queryData.id
            };
            ShareData.create(shareDataT, function (err, shareData) {
                if (err) {
                    res.status(400);
                } else {
                    res.send(shareData._id);
                }
            });

        }
    });
});

app.use('/api', router);

app.listen(port);
console.log('Magic happens on port ' + port);



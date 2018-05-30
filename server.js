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
var TeacherData = require('./model/TeacherData');
var User = require('./model/User');
var cookieParser = require('cookie-parser');  // Чтенение кук

var authorization = require('./src/internal/cheackAuthorization');

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


// Коннект к базе
mongoose.connect('mongodb://localhost/results', function (err) {
    if (err) {
        console.err(err);
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

app.get('/js/generateQrCode.js', function (req, res) {
    res.sendFile(path.join(__dirname + '/src/js/actions/generateQrCode.js'));
});

app.get('/js/login.js', function (req, res) {
    res.sendFile(path.join(__dirname + '/src/js/actions/login.js'));
});

app.get('/js/utils.js', function (req, res) {
    res.sendFile(path.join(__dirname + '/src/js/utils/utils.js'));
});


// HTML

app.get('/registration', function (req, res) {
    res.sendFile(path.join(__dirname + '/src/register.html'));
});

app.get('/login', function (req, res) {
    res.sendFile(path.join(__dirname + '/src/login.html'));
});



// Запрос главной страницы, если это залогиненый студент, то перенаправляем его на результаты, в противном случае
// перенаправляем на логин
app.get('/', function (req, res) {
    User.find({'_id': req.session.userId, 'teacher': false}, function (err, results) {
        if (results.length === 1) {
            res.sendFile(path.join(__dirname + '/src/userData.html'));
        } else {
            res.redirect('/login');
        }
    });
});

// Регистрация нового пользователя
app.post('/register', function (req, res) {

    if (req.body.username &&
        req.body.password &&
        req.body.name &&
        req.body.surname &&
        req.body.isTeacher) {

        var userData = {
            username: req.body.username,
            password: req.body.password,
            name: req.body.name,
            surname: req.body.surname,
            teacher: req.body.isTeacher === "Преподаватель"
        };
        User.create(userData, function (err, user) {
            if (err) {
                res.status(400);
                res.send('Пользователь не создан');
            } else {
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

app.get('/api/username', function(req, res) {
    User.find({'_id': req.session.userId}, function (err, results) {
        res.send(results[0]._doc.username);
    });
});

app.get('/api/logout', function(req, res, next) {
    if (req.session) {
        // delete session object
        req.session.destroy(function(err) {
            if(err) {
                return next(err);
            } else {
                return res.redirect('/');
            }
        });
    }
});


// Запрос данных в формате json
app.get('/api/userdata', function (req, res) {

    if(authorization.isStudent()) {
        StudentData.find({'studentId': req.session.userId}, function (err, results) {
            if (err)
                res.send(err);
            res.json(results);
        }).select('-results');
    } else if (authorization.isTeacher()) {
        TeacherData.find({'teacherId': req.session.userId}, function (err, results) {
            if (err)
                res.send(err);
            res.json(results);
        });
    } 
});




app.get('/share/:id', function (req, res) {

    var shareDataId = req.params.id;

    ShareData.find({'_id': shareDataId}, function(err, results) {

        if (results.length !== 1) {
            // записи нет, вернуть ошибку
        }
        
        if (results[0]._doc.toUserType == "student" && authorization.isStudent(req) ) {
            if (results[0]._doc.toGroup === USERGROUP || results[0]._doc.toUser === authorization.getUserName()) {
                res.json(results);
            }
        }

        if (results[0]._doc.toUserType == "teacher" && authorization.isTeacher(req) ) {
                res.json(results);
        }

        if (results[0]._doc.toUserType == "all") {
            res.json(results);
        }
        
    });
    

    // Проверяем пользователя, пытающегося перейти по ссылке в QR коде
    User.find({'username': req.session.userId, 'isTeacher': true}, function (err, results) {

        // Если это студент или не залогиненый человек, создаем куку с id тестов и перенаправляем на страницу логина
        if (results.length === 0) {
            res.status(403);
            res.send();

        } else {
            
            return res.redirect('/share_page')
        }

    });
});


app.get('/api/share', function (req, res) {

    //Проверяем сессию - студент или преподаватель
    User.find({'_id': req.session.userId, 'teacher': true}, function (err, results) {


        // Если преподаватель, то берем тесты из qr кода
        if (results.length === 1) {

            Result.find({_id: {$in: req.cookies.tests}}, function (err, results) {
                if (err)
                    res.send(err);
                res.json(results);
            });

            // Если студент, то берем все тесты студента БЕЗ ВОПРОСОВ И ОТВЕТОВ
        } else {
            Result.find({'studentId': req.session.userId}, function (err, results) {
                if (err)
                    res.send(err);
                res.json(results);
            }).select('-results');
        }
    });


});

app.use('/api', router);

app.listen(port);
console.log('Magic happens on port ' + port);





'use strict';
const express = require('express'),
    app = express(),
    https = require('https'),
    fs = require('fs'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    logger = require('morgan'),
    config = require('./config');

const index = require('./routes/index');
const auth = require('./routes/auth');
const user = require('./routes/user');

const option = {
    key: fs.readFileSync(path.join(__dirname, '/ssl/oauth.pem')),
    cert: fs.readFileSync(path.join(__dirname, '/ssl/oauth.crt'))
}

//app.use(logger('dev'));
//View engine
app.set('views', path.join(__dirname, 'client'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.disable('x-powered-by');
//Set static folder
app.use(express.static(path.join(__dirname, 'client')));

//Body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session(config.session));

app.use('/', index);
app.use('/auth', auth);
app.use('/user', user);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((err, req, res, next) => res.status(err.status || 500).end(err));
}

//app.set('env', 'production');
app.set('port', process.env.PORT || config.port);
https.createServer(option, app).listen(app.get('port'), () => {
    console.log(`Server started in ${app.get('env')} mode on port ${app.get('port')}.`);
});
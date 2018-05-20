var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var expressHbs = require('express-handlebars');
var bodyParser = require('body-parser');
var Parseador = require('./models/iso');
var mongoose = require('mongoose');

var index = require('./routes/index');
var cuenta = require('./routes/cuenta');
var canal = require('./routes/canal');
var prueba = require('./routes/prueba');
var ejecutarTrx = require('./routes/ejecutarTrx');


var app = express();

mongoose.connect('mongodb://localhost:27017/Tester');
mongoose.connection.on('error', function(err){
	console.log(' \x1b[41m%s\x1b[0m','Error al intentar conectar con MongoDB.', 'Mensaje: ' + err.message);
	process.exit();
});

// view engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');
app.use('/public', express.static('public'));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/cuenta', cuenta);
app.use('/canal', canal);
app.use('/prueba', prueba);
app.use('/ejecutarTrx', ejecutarTrx);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

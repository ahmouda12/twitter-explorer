require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const session      = require('express-session');
const passport     = require('passport');
var cors           = require('cors');


mongoose.Promise = Promise;
mongoose
  .connect('mongodb://localhost/twitter-explorer', {useMongoClient: true})
  .then(() => {
    console.log('Connected to Mongo!');
  }).catch(err => {
    console.error('Error connecting to mongo', err);
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

// Passport setup
const passportSetup = require('./config/passport');
passportSetup(passport);

const app = express();

// Session Middleware
app.use(session({
  secret: 'angular auth passport secret shh',
  resave: true,
  saveUninitialized: true,
  cookie : { httpOnly: true, maxAge: 2419200000 }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(cors({credentials: true, origin: ["http://localhost:4200"]}));

// Socket setup
const server = require('http').Server(app);
const io = require('socket.io')(server);

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Socket Middleware
app.use(function(req, res, next){
  res.io = io;
  next();
});

// Express View engine setup
app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// default value for title local
app.locals.title = 'Twitter - Explorer';

const index = require('./routes/index');
const authRoutes = require('./routes/auth-routes');
app.use('/', index);
app.use('/', authRoutes);

app.use((req, res, next) => {
  res.sendFile(__dirname + '/public/index.html');
});

// module.exports = app;
module.exports = {app: app, server: server};

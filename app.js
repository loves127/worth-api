require('./config/mongoose.js');
let createError = require('http-errors'),
    express = require('express'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    methodOverride = require('method-override');
    session = require('express-session');
    bodyParser = require('body-parser'),
    logger = require('morgan');

let indexRouter = require('./routes/index'),
  usersRouter = require('./routes/users'),
  postRouter = require('./routes/post'),
  companyRouter = require('./routes/company'),
  departmentRouter = require('./routes/department'),
  accountRouter = require('./routes/account'),
  incomeTypeRouter = require('./routes/incomeType'),
  expenditureTypeRouter = require('./routes/expenditureType'),
  payTypeRouter = require('./routes/payType'),
  incomeRouter = require('./routes/income'),
  expenditureRouter = require('./routes/expenditure'),
  transferRecordRouter = require('./routes/transferRecord'),
  budgetRouter = require('./routes/budget'),
  menuRouter = require('./routes/menu'),
  analysisRouter = require('./routes/analysis');

let app = express();

/**
 * 设置请求头 解决跨域问题
 * application/json  接口返回json数据
 * charset=utf-8 解决json数据中中文乱码
 */
//allow custom header and CORS
app.all('*',function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    res.send(200);
  }
  else {
    next();
  }
});

app.use(logger('dev'));
app.use(express.json());
app.use(methodOverride());
app.use(session({ resave: true,
  saveUninitialized: true,
  secret: 'uwotm8' }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 路由
app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/post', postRouter);
app.use('/company', companyRouter);
app.use('/department', departmentRouter);
app.use('/account', accountRouter);
app.use('/incomeType', incomeTypeRouter);
app.use('/expenditureType', expenditureTypeRouter);
app.use('/payType', payTypeRouter);
app.use('/income', incomeRouter);
app.use('/expenditure', expenditureRouter);
app.use('/transferRecord', transferRecordRouter);
app.use('/budget', budgetRouter);
app.use('/menu', menuRouter);
app.use('/analysis', analysisRouter);
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

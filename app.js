var express = require('express');
	cors = require('cors');
    app = express();
    passport = require('passport');
    mongoose = require('mongoose');
    session = require('client-sessions');
    randomstring = require('randomstring');
    config = require('./config');
    User = require('./models/userModel');
    passportConfig = require('./config/passport')
    apiController = require('./controllers/apiController');
    SECRET = randomstring.generate();
    port = process.env.PORT || 3000;

app.use(cors());
app.use('/assets', express.static(__dirname + '/app'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({'message' : err.name + ': ' + err.message});
  }
});
app.use(passport.initialize());

mongoose.connect(config.getDbConnectionString());
apiController(app);

app.listen(port);
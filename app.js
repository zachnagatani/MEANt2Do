var express = require('express');
	cors = require('cors');
    app = express();
    mongoose = require('mongoose');
    session = require('client-sessions');
    randomstring = require('randomstring');
    config = require('./config');
    apiController = require('./controllers/apiController');
    SECRET = randomstring.generate();
    port = process.env.PORT || 3000;

app.use(cors());
app.use('/assets', express.static(__dirname + '/app'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

mongoose.connect(config.getDbConnectionString());
apiController(app);

app.listen(port);
var express = require('express');
    app = express();
    mongoose = require('mongoose');
    session = require('client-sessions');
    randomstring = require('randomstring');
    config = require('./config');
    SECRET = randomstring.generate();
    port = process.env.PORT || 3000;

app.use('/assets', express.static(__dirname + '/app'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

mongoose.connect(config.getDbConnectionString());

app.get('/', function(req, res) {
	res.sendFile('index.html', {
		root: __dirname + '/app'
	});
});

app.listen(port);
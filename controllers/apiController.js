// Controller for api endpoints
// Endpoints are to be connected to via the front-end of choice

var Todos = require('../models/todoModel');
	User = require('../models/userModel');
	bodyParser = require('body-parser');
    jwt = require('express-jwt');
    auth = jwt({
        secret: 'MY_SECRET',
        userProperty: 'payload'
    });

module.exports = function(app) {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    // Cookie info for user sessions
    app.use(session({
        cookieName: 'session',
        secret: SECRET,
        duration: 30 * 60 * 1000,
        activeDuration: 5 * 60 * 1000 
    }));

    // Get all the todos that belong to a specific user
    app.get('/api/todos', auth, function(req, res) {
        // Grab all of the Todos instances
        if (!req.payload._id) {
            res.status(401).json({
                'message': 'Unauthorized error: private dashboard'
            });
        } else {
            Todos.find({ username: req.payload.username })
                .exec(function(err, todos) {
                    res.status(200).json(todos);
                });
        }
    });

    app.get('/api/todo/:id', function(req, res) {
        // by the id that was passed to the URL
        Todos.findById({
            _id: req.params.id
        }, function(err, todo) {
            if (err) throw err;
            // Return that todo as the HTTP response
            res.send(todo);
        });
    });

    // TODO: authenticate user before adding todo
    app.post('/api/todos/new', auth, function(req, res) {
        var newTodo = Todos({
            username: req.payload.username,
            todo: req.body.todo,
            isDone: false
        });

        newTodo.save(function(err) {
            if (err) throw err;
            res.sendStatus(200);
        });
    });

    app.post('/api/todos/update', auth, function(req, res) {
    	// TODO: Add method for updating todos
        console.log('finding...');
        Todos.findByIdAndUpdate({ _id: req.body.id }, {
            todo: req.body.todo,
            isDone: req.body.isDone
        }, function(err, todo) {
            if (err) return res.sendStatus(404);
            res.sendStatus(200);
        });
    });

    // Handles deleting todos
    app.delete('/api/todos/delete/:id', auth, function(req, res) {
        // Find it by id and remove it!
        Todos.findByIdAndRemove({ _id: req.params.id }, function(err) {
            if (err) return res.sendStatus(404);
            res.sendStatus(200);
        });
    });

    // Gets user data for a specific user
    app.get('/api/users/dashboard', auth, function(req, res) {
        if (!req.payload._id) {
            res.status(401).json({
                'message': 'Unauthorized error: private dashboard'
            });
        } else {
            User.findById(req.payload._id)
                .exec(function(err, user) {
                    res.status(200).json(user);
                });
        }
    });

    // Handles user signup
    app.post('/api/users/signup', function(req, res) {
    	// Checks to see if user exists by username
        User.findOne({
            username: req.body.username
        }, function(err, user) {
        	// If so, return and send username error
        	// TODO: Better handling for username error (remove res.send)
            if (user) return res.status(409).send('Username already exists');

            // Create new instance of a user
            var newUser = User({
                username: req.body.username,
                password: req.body.password
            });

            // Save the user to the db
            newUser.save(function(error) {
                var token;
                token = newUser.generateJwt();
                res.status(200);
                res.json({
                    'token': token
                });
            });
        });
    });

    // Logs the user in
    app.post('/api/users/login', function(req, res) {
        passport.authenticate('local', function(err, user, info) {
            var token;

            // If Passport throws/catches an error
            if (err) {
              res.status(404).send(req.body.username);
              return;
            }

            if(user) {
                token = user.generateJwt();
                res.status(200);
                res.json({
                    'token': token
                });
            } else {
                res.status(401).json(info);
            }
        })(req, res);
    });

    // Handles deleting a user
    app.delete('/api/users/:username',  function(req, res) {
        User.findByIdAndRemove(req.body.id, function(err) {
            if (err) throw err;
            res.send('User deleted!');
        });
    });
};
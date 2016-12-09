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

function requireLogin (req, res, next) {
    if (!req.session.user) {
        // res.redirect('/login');
    } else {
        next();
    }
}

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
        // Todos.find({
        //     // that belong to the username passed into the URL
        //     username: req.params.username
        // }, function(err, todos) {
        //     if (err) throw err;
        //     // Send the todos grabbed from Mongo as the HTTP response
        //     res.send(todos);
        // });

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
    app.post('/api/todo/new', function(req, res) {
        console.log('adding...');
        var newTodo = Todos({
            username: req.body.username,
            todo: req.body.todo,
            isDone: false
        });

        newTodo.save(function(err) {
            if (err) throw err;
            res.sendStatus(200);
        });
    });

    app.post('/api/todo/update', function(req, res) {
    	// TODO: Add method for updating todos
    });

    // Handles deleting todos
    app.delete('/api/todo/delete', function(req, res) {
        // Find it by id and remove it!
        Todos.findByIdAndRemove(req.body.id, function(err) {
            if (err) throw err;
            res.send('Todo deleted!');
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

                // if (error) return res.status(400).end();

                // return res.sendStatus(200);
                // set the session to that user
                // req.session.user = newUser;
                // res.send('User saved!');
                // redirect to the dashboard
                // res.redirect('/dashboard');
            });
        });
    });

    // Logs the user in
    app.post('/api/users/login', function(req, res) {
        // Grab the user from the username provided
        // User.findOne({
        //     username: req.body.username
        // }, function(err, user) {
        //     // Compare the entered pw to the pw in the db
        //     if (user) { 
        //         user.comparePassword(req.body.password, function(err, isMatch) {
        //             if (err) throw err;
        //             // If it matches,
        //             if (isMatch) {
        //                 // Set the user property on our session to the user
        //                 // req.session.user = user;
        //                 // Hide the users password
        //                 // req.session.user.password = null;
        //                 // res.redirect('/dashboard');
        //                 res.sendStatus(200);
        //             } else {
        //                 res.sendStatus(400);
        //             	// TODO: Better error handling
        //                 // res.send('Invalid username or password');
        //             }
        //         });
        //     } else {
        //         res.sendStatus(400);
        //         // res.redirect('/signup');
        //     }
        // });
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
    app.delete('/api/users/:username', requireLogin, function(req, res) {
        User.findByIdAndRemove(req.body.id, function(err) {
            if (err) throw err;
            res.send('User deleted!');
        });
    });
};
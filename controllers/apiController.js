// Controller for api endpoints
// Endpoints are to be connected to via the front-end of choice

var Todos = require('../models/todoModel');
	User = require('../models/userModel');
	bodyParser = require('body-parser');

function requireLogin (req, res, next) {
    if (!req.session.user) {
        res.redirect('/login');
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
    app.get('/api/todos/:username', function(req, res) {
        // Grab all of the Todos instances
        Todos.find({
            // that belong to the username passed into the URL
            username: req.params.username
        }, function(err, todos) {
            if (err) throw err;
            // Send the todos grabbed from Mongo as the HTTP response
            res.send(todos);
        });
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
        var newTodo = Todos({
            username: req.session.user.username,
            todo: req.body.todo,
            isDone: false
        });

        newTodo.save(function(err) {
            if (err) throw err;
            res.redirect('/dashboard');
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
    app.get('/api/users/:username', function(req, res) {
        User.findOne({
            username: req.params.username
        }, function(err, user) {
            if (err) throw err;
            res.send(user);
        });
    });

    // Handles user signup
    app.post('/api/users/signup', function(req, res) {
    	// Checks to see if user exists by username
        User.findOne({
            username: req.body.username
        }, function(err, user) {
        	// If so, return and send username error
        	// TODO: Better handling for username error (remove res.send)
            if (user) return res.send('Username already exists');

            // Create new instance of a user
            var newUser = User({
                username: req.body.username,
                password: req.body.password
            });

            // Save the user to the db
            newUser.save(function(error) {
                if (error) throw error;
                // set the session to that user
                req.session.user = newUser;
                // redirect to the dashboard
                res.redirect('/dashboard');
            });
        });
    });

    // Logs the user in
    app.post('/api/users/login', function(req, res) {
        // Grab the user from the username provided
        User.findOne({
            username: req.body.username
        }, function(err, user) {
            // Compare the entered pw to the pw in the db
            if (user) { 
                user.comparePassword(req.body.password, function(err, isMatch) {
                    if (err) throw err;
                    // If it matches,
                    if (isMatch) {
                        // Set the user property on our session to the user
                        req.session.user = user;
                        // Hide the users password
                        req.session.user.password = null;
                        res.redirect('/dashboard');
                    } else {
                    	// TODO: Better error handling
                        res.send('Invalid username or password');
                    }
                });
            } else {
                res.redirect('/signup');
            }
        });
    });

    // Handles deleting a user
    app.delete('/api/users/:username', requireLogin, function(req, res) {
        User.findByIdAndRemove(req.body.id, function(err) {
            if (err) throw err;
            res.send('User deleted!');
        });
    });
};
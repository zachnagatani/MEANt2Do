var passport = require('passport');
	LocalStrategy = require('passport-local').Strategy;
	mongoose = require('mongoose');
	User = mongoose.model('User');

passport.use(new LocalStrategy(function(username, password, done) {
    User.findOne({
        username: username
    }, function(err, user) {
    	if (err) return done(err);

    	if (!user) {
    		return done(null, false, {
    			message: 'User not found'
    		});
    	} else {
            user.comparePassword(password, function(err, isMatch) {
                if (err) throw err;
                // If it matches,
                if (isMatch) {
                    return done(null, user);
                    // res.sendStatus(200);
                } else {
                	return done(null, false, {
                		message: 'Password is wrong'
                	});
                }
            });
    	}
    });
}));
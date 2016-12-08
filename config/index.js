var configValues = require('./config');

module.exports = {
    getDbConnectionString: function() {
        return 'mongodb://' + configValues.username + ':' + configValues.password + '@ds127928.mlab.com:27928/meant2do';
    }
};
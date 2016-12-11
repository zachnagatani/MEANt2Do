(function() {
	'use strict';

	angular.module('meantodo')
		.controller('signupCtrl', ['$scope', '$state', 'apiPOST', 'authentication', function($scope, $state, apiPOST, authentication) {
			var self = this;
				URL = 'http://localhost:3000/api/users/signup';

			self.state = 'Signup';

			self.signup = function(username, password, event) {
				event.preventDefault();
				apiPOST.post(URL, { 'username': username, 'password': password })
					.then(function success(response) {
						if (response.status === 200) {
							authentication.saveToken(response.data.token);
							$scope.$emit('loggedIn', authentication.isLoggedIn());
							$state.go('dashboard');
						}
					}, function error(response) {
						// Todo: prettier error handling
						self.usernameConflict = true;
					});
			};
		}]);
}());
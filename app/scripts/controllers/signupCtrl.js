(function() {
	'use strict';

	angular.module('meantodo')
		.controller('signupCtrl', ['$scope', '$state', 'apiPOST', function($scope, $state, apiPOST) {
			var self = this;
				URL = 'http://localhost:3000/api/users/signup';

			self.state = 'Signup';

			self.signup = function(username, password, event) {
				event.preventDefault();
				apiPOST.post(URL, { 'username': username, 'password': password })
					.then(function(response) {
						if (response.status === 200) {
							$state.go('dashboard');
						}
					});
			};
		}]);
}());
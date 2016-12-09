(function() {
	'use strict';

	angular.module('meantodo')
		.controller('indexCtrl', ['$scope', '$state', 'authentication', function($scope, $state, authentication) {
			var self = this;
			console.log(authentication.isLoggedIn());
			self.isLoggedIn = authentication.isLoggedIn();
			self.currentUser = authentication.currentUser();
			self.logout = function(event) {
				// Delete the token
				authentication.logout();
				// Reload so auth is run again, and we are taken out of the dashboard
				$state.reload();
			};

			$scope.$on('loggedIn', function(event, loggedIn) {
				console.log(loggedIn);
				self.isLoggedIn = loggedIn;
			});
		}]);
}());
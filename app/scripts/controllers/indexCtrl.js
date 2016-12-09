(function() {
	'use strict';

	angular.module('meantodo')
		.controller('indexCtrl', ['$scope', 'authentication', function($scope, authentication) {
			var self = this;
			console.log(authentication.isLoggedIn());
			self.isLoggedIn = authentication.isLoggedIn();
			self.currentUser = authentication.currentUser();
			$scope.$on('loggedIn', function(event, loggedIn) {
				console.log(loggedIn);
				self.isLoggedIn = loggedIn;
			});
		}]);
}());
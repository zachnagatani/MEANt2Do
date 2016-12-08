(function() {
	'use strict';

	angular.module('meantodo')
		.controller('signupCtrl', ['$scope', function($scope) {
			var self = this;

			self.state = 'Signup';
		}]);
}());
(function() {
	'use strict';

	angular.module('meantodo')
		.controller('loginCtrl', ['$scope', function($scope) {
			var self = this;

			self.state = 'Login';
		}]);
}());
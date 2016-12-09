(function() {
	'use strict';

	angular.module('meantodo')
		.controller('dashboardCtrl', ['$scope', '$state', 'authentication', 'apiGET', 'apiPOST', function($scope, $state, authentication, apiGET, apiPOST) {
			var self = this;
			var GETURL = 'http://localhost:3000/api/todos';
			var POSTURL = 'http://localhost:3000/api/todos/new';
			var token = authentication.getToken();
			if (!authentication.isLoggedIn()) $state.go('login');

			self.getTodos = function() {
				apiGET.get(GETURL, {
					headers: {
						Authorization: 'Bearer ' + token
					}
				})
					.then(function(response) {
						self.todos = response.data;
					});
			};
			self.getTodos();

			self.addTodo = function(todo, event) {
				event.preventDefault();
				apiPOST.post(POSTURL, {'todo': todo }, {
					headers: {
						Authorization: 'Bearer ' + token
					}
				})
					.then(function(response) {
						self.getTodos();
					}, function(response) {
						console.log(response);
					});
			};
		}]);
}());
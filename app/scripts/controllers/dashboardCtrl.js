(function() {
	'use strict';

	angular.module('meantodo')
		.controller('dashboardCtrl', ['$scope', '$state', 'authentication', 'apiGET', 'apiPOST', function($scope, $state, authentication, apiGET, apiPOST) {
			var self = this;
			var GETURL = 'http://localhost:3000/api/todos';
			var NEWTODOURL = 'http://localhost:3000/api/todos/new';
			var UPDATETODOURL = 'http://localhost:3000/api/todos/update'
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
				apiPOST.post(NEWTODOURL, {'todo': todo }, {
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

			self.enterEditing = function(todo) {
				self.editing = true;
				self.currentTodo = todo;
				console.log(self.currentTodo);
			};

			self.updateTodo = function(currentTodo, todo, event) {
				event.preventDefault();
				// console.log(currentTodo, todo);
				console.log(currentTodo._id);
				apiPOST.post(UPDATETODOURL, { 'id': currentTodo._id, 'todo': todo }, {
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
var testingAngularApp = angular.module('testingAngularApp', []);

testingAngularApp.controller('testingAngularCtrl', function() {
	var vm = this;
	vm.title = 'Testing AngularJS Applications';
	vm.destinations = [];

	vm.newDestination = {
		city: undefined,
		country: undefined
	};

	vm.addDestination = function () {
		vm.destinations.push({
			city: vm.newDestination.city,
			country: vm.newDestination.country
		});
	}
});



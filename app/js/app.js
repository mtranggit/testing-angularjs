var testingAngularApp = angular.module('testingAngularApp', []);

testingAngularApp.controller('testingAngularCtrl', ['$scope', '$rootScope', '$http', '$timeout', 'weatherService', function($scope, $rootScope, $http, $timeout, weatherService) {
	var vm = this;
	vm.weatherAPIKey = '5dbde18df5eb784eb2f6b010c598c106';
	vm.title = 'Testing AngularJS Applications';
	vm.destinations = [];
	// vm.message = '';
	$rootScope.message = '';

	vm.newDestination = {
		city: undefined,
		country: undefined
	};

	vm.destination = { city: undefined, country: undefined, weather: undefined};

	vm.addDestination = function () {
		vm.destinations.push({
			city: vm.newDestination.city,
			country: vm.newDestination.country
		});
	};

	vm.removeDestination = function (index) {
		vm.destinations.splice(index,1);
	};

	// vm.getWeather = function (destination) {
	// 	// vm.destination.city = destination.city;
	// 	// vm.destination.country = destination.country;
	// 	$http.get('http://api.openweathermap.org/data/2.5/weather?q=' + destination.city + '&appid=' + vm.weatherAPIKey)
	// 		.then(
	// 			function successCallback(response) {
	// 				// console.log(JSON.stringify(response, undefined, 2));
	// 				if(response.data.weather) {
	// 					destination.weather = {};
	// 					destination.weather.main = response.data.weather[0].main;
	// 					destination.weather.temp = weatherService.convertKelvinToCelsius(response.data.main.temp);
	// 				}
	// 				else {
	// 					vm.message = 'City not found';
	// 				}
	// 			},
	// 			function errorCallback(error) {
	// 				console.log(error);
	// 				vm.message = 'Server error';
	// 			}
	// 		);
	// };

	// vm.convertKelvinToCelsius = function (temp) {
	// 	return Math.round(temp - 273);
	// }

	//add a scope watcher for this controller's message
	// $scope.$watch(angular.bind($rootScope, function () {
	$rootScope.$watch(angular.bind($rootScope, function () {
		// if (vm.message) {
		if ($rootScope.message) {
			$timeout(function () {
				//vm.message = null;
				$rootScope.message = null;
			}, 3000);
		}
	}));

}]);

//custom service
testingAngularApp.factory('weatherService', function () {
	var vm = {};

	function convertKelvinToCelsius(temp) {
		return Math.round(temp - 273);
	}

	vm.convertKelvinToCelsius = convertKelvinToCelsius;

	return vm;

});

//custom filter
testingAngularApp.filter('warmestDestinations', function () {
	return function (destinations, minimumTemp) {
		var warmDestinations = [];
		angular.forEach(destinations, function (destination) {
			if (destination.weather && destination.weather.temp && destination.weather.temp >= minimumTemp) {
				warmDestinations.push(destination);
			}
		});
		return warmDestinations;
	};
});

//custom directive
testingAngularApp.directive('destinationDirective', function () {
	return {
		restrict: 'EA',
		scope: {
			destination: '=',
			apiKey: '@',
			onRemove: '&'
		},
		controller: function($http, $scope, $rootScope, weatherService) {
			$scope.getWeather = function (destination) {
				// vm.destination.city = destination.city;
				// vm.destination.country = destination.country;
				$http.get('http://api.openweathermap.org/data/2.5/weather?q=' + destination.city + '&appid=' + $scope.apiKey)
					.then(
						function successCallback(response) {
							// console.log(JSON.stringify(response, undefined, 2));
							if(response.data.weather) {
								destination.weather = {};
								destination.weather.main = response.data.weather[0].main;
								destination.weather.temp = weatherService.convertKelvinToCelsius(response.data.main.temp);
							}
							else {
								// $scope.message = 'City not found';
								$rootScope.message = 'City not found';
							}
						},
						function errorCallback(error) {
							// console.log(error);
							// $scope.message = 'Server error';
							$rootScope.message = 'Server error';
						}
					);
			};
		},
		template:['<span>{{destination.city}}, {{destination.country}}</span>',
    			'<span ng-if="destination.weather"> - {{destination.weather.main}}, {{destination.weather.temp}}</span>',
    			'<button ng-click="onRemove()">Remove</button>',
    			'<button ng-click="getWeather(destination)">Update Weather</button>'].join(" ")
	}
})

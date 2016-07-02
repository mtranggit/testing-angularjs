describe('Testing AngularJS Test Suite', function() {

    beforeEach(module('testingAngularApp'));

    describe('Testing AngularJS Controller', function() {
        var ctrl, $controller, $rootScope, $scope, $httpBackend, $timeout;

        beforeEach(inject(function(_$controller_, _$rootScope_, _$httpBackend_, _$timeout_) {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $httpBackend = _$httpBackend_;
            $timeout = _$timeout_;
            $scope = $rootScope.$new();
            ctrl = $controller('testingAngularCtrl', {
                $scope: $scope
            });
        }));

        // afterEach(function() {
        //     //cleanup code
        //     $httpBackend.verifyNoOutstandingExpectation();
        //     $httpBackend.verifyNoOutstandingRequest();
        // });

        it('should initialize the title in the scope', function() {
            expect(ctrl.title).toBeDefined();
            expect(ctrl.title).toBe('Testing AngularJS Applications');
        });

        it('should add 2 destinations to the destinations list', function() {
            expect(ctrl.destinations).toBeDefined();
            expect(ctrl.destinations.length).toBe(0);

            ctrl.newDestination = {
                city: 'London',
                country: 'England'
            };

            ctrl.addDestination();
            expect(ctrl.destinations.length).toBe(1);
            expect(ctrl.destinations[0].city).toBe('London');
            expect(ctrl.destinations[0].country).toBe('England');

            ctrl.newDestination = {
                city: 'Frankfurt',
                country: 'Germany'
            };

            ctrl.addDestination();
            expect(ctrl.destinations.length).toBe(2);
            expect(ctrl.destinations[0].city).toBe('London');
            expect(ctrl.destinations[0].country).toBe('England');
            expect(ctrl.destinations[1].city).toBe('Frankfurt');
            expect(ctrl.destinations[1].country).toBe('Germany');
        });

        it('should remove a destination from the destinations list', function() {
            ctrl.destinations = [{
                city: 'Salt Lake City',
                country: 'USA'
            }, {
                city: 'Hanoi',
                country: 'Viet Nam'
            }, {
                city: 'Melbourne',
                country: 'Australia'
            }];

            expect(ctrl.destinations.length).toBe(3);
            ctrl.removeDestination(0);
            expect(ctrl.destinations.length).toBe(2);
            expect(ctrl.destinations[0].city).toBe('Hanoi');
            expect(ctrl.destinations[0].country).toBe('Viet Nam');

        });

        // it('should update the weather for a specific destination', function() {
        //     ctrl.destination = {
        //         city: 'Sydney',
        //         country: 'Australia'
        //     };

        //     $httpBackend.expectGET('http://api.openweathermap.org/data/2.5/weather?q=' + ctrl.destination.city + '&appid=' + ctrl.weatherAPIKey)
        //         .respond({
        //             weather: [{ main: 'Rain', detail: 'Light rain' }],
        //             main: { temp: 288 }
        //         });
        //     ctrl.getWeather(ctrl.destination);

        //     //tell Angularjs to flush out all pending requests
        //     $httpBackend.flush();

        //     expect(ctrl.destination.weather.main).toBe('Rain');
        //     expect(ctrl.destination.weather.temp).toBe(15);
        // });

        it('should remove the error message after a fixed period of time', function() {
            // ctrl.message = 'Some error';
            // expect(ctrl.message).toBe('Some error');

            $rootScope.message = 'Some error';
            expect($rootScope.message).toBe('Some error');
            //tell angular to check for any changes and fire off the digest cycle
            $rootScope.$apply();
            $timeout.flush();
            expect($rootScope.message).toBeNull();
        });
    });

    describe('Testing AngularJS filter', function() {
        var warmest, warmestDestinations, destinations, $filter;
        it('should return only warmest destinations', function() {

            inject(function(_$filter_) {
                $filter = _$filter_;
                warmest = $filter('warmestDestinations');
            });

            destinations = [
                { city: 'Beijing', country: 'China', weather: { temp: 10 } },
                { city: 'Moscow', country: 'Russia', tweather: { temp: -5 } },
                { city: 'Lima', country: 'Peru', weather: { temp: 18 } },
                { city: 'Auckland', country: 'Peru' },
                { city: 'Mexico City', country: 'Mexico', weather: { temp: 12 } }
            ];

            expect(destinations.length).toBe(5);
            warmestDestinations = warmest(destinations, 11);
            expect(warmestDestinations.length).toBe(2);
            expect(warmestDestinations[0].city).toBe('Lima');
            expect(warmestDestinations[1].city).toBe('Mexico City');

        });
    });

    describe('Testing AngularJS service', function() {
        var weatherService;
        it('should correctly convert Kelvin to Celsius', function() {
            inject(function(_weatherService_) {
                weatherService = _weatherService_;
            });
            expect(weatherService.convertKelvinToCelsius(288)).toBe(15);
            expect(weatherService.convertKelvinToCelsius(273)).toBe(0);
        });
    });

    describe('Testing AngularJS Directive', function() {
    	var scope, compile, element, template, isolateScope, $rootScope, $httpBackend;
        beforeEach(function() {
        	inject(function($compile, _$rootScope_, _$httpBackend_) {
        		$rootScope = _$rootScope_;
        		scope = $rootScope.$new();
        		compile = $compile;
        		$httpBackend = _$httpBackend_;
        	});

        	scope.destination = {
        		city: 'Tokyo',
        		country: 'Japan'
        	};

        	scope.apiKey = 'xyz';

        	element = angular.element('<div destination-directive destination="destination" api-key="apiKey" on-remove="remove()"></div>');

        	template = compile(element)(scope);

        	scope.$digest();

        	isolateScope = element.isolateScope();

        });

        it('should update the weather for a specific destination', function() {
            scope.destination = {
                city: 'Sydney',
                country: 'Australia'
            };

            $httpBackend.expectGET('http://api.openweathermap.org/data/2.5/weather?q=' + scope.destination.city + '&appid=' + isolateScope.apiKey)
                .respond({
                    weather: [{ main: 'Rain', detail: 'Light rain' }],
                    main: { temp: 288 }
                });

            isolateScope.getWeather(scope.destination);

            //tell Angularjs to flush out all pending requests
            $httpBackend.flush();

            expect(scope.destination.weather.main).toBe('Rain');
            expect(scope.destination.weather.temp).toBe(15);
        });

        it('should call the parent controller remove function', function() {
        	scope.removeTest = 1;
        	scope.remove = function () {
        		scope.removeTest++;
        	}		

        	isolateScope.onRemove();
        	expect(scope.removeTest).toBe(2);
        });

        it('should generate the correct html', function() {
        	var templateAsHtml = template.html();
        	expect(templateAsHtml).toContain('Tokyo, Japan');

        	scope.destination.city = 'Ho Chi Minh City';
        	scope.destination.country = 'Viet nam';

        	scope.$digest();
        	templateAsHtml = template.html();
        	dump(templateAsHtml);
        	expect(templateAsHtml).toContain('Ho Chi Minh City, Viet nam'); 

        });

    });
});

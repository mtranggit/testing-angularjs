describe('Testing AngularJS Test Suite', function() {

	beforeEach(module('testingAngularApp'));

    describe('Testing AngularJS Controller', function() {
		var ctrl, $controller, $rootScope, scope;

    	beforeEach(inject(function(_$controller_, _$rootScope_) {
    		$controller = _$controller_;
	    	$rootScope = _$rootScope_;	
	    	scope = $rootScope.$new();
	    	ctrl = $controller('testingAngularCtrl');
	    }));

	    afterEach(function() {
	    	//cleanup code
	    });

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

    });

});

'use strict';
myAppModule.config(['$routeProvider', function($routeProvider)
{
	$routeProvider.when('/error/404',
	{
		templateUrl : 'angular/partial/error/404.html',
		controller	: 'Error404Controller' 
	});
	$routeProvider.when('/error/500',
	{
		templateUrl : 'angular/partial/error/500.html',
		controller	: 'Error500Controller' 
	});	
}]);

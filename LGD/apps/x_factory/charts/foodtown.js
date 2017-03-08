angular.module('starter')
.factory('ChartsFoodtownFac',function($rootScope,$http,$q,$filter,$window,UtilService,ArrayObjectService)
{
	return{
			GetCustomerCharts:GetCustomerCharts,
		}
});
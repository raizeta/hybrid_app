angular.module('starter')
.factory('authInterceptor', function ($rootScope, $q, $window,StorageService) 
{
  return {
    request: function (config) {
      config.headers = config.headers || {};

      config.headers.Authorization = 'Bearer 7VfRncAwITfZrY2THUGkNq9JZOyExS5u';
      return config;
    },
    response: function (response) 
    {
      if (response.status === 401) 
      {
        // handle the case where the user is not authenticated
      }
      return response || $q.when(response);
    }
  };
});

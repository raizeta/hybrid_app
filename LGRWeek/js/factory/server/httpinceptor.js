angular.module('starter')
.factory('authInterceptor', function ($rootScope, $q, $window,StorageService) 
{
  return {
    request: function (config) {
      config.headers = config.headers || {};
      var storage = StorageService.get('profile');
      if (storage) 
      {
        config.headers.Authorization = 'Bearer ' + storage.accessToken;
      }
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

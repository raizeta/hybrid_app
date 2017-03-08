angular.module('starter')
.filter('capitalize', function() 
{
    return function(input) 
    {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
})
.filter('wrapup', function () {
  return function (input) {
    if (input) {
      return input.replace(/\n/g, "<br />");
    }
  };
});
angular.module('starter')
.service('ArrayObjectService',function($window)
{
    var DiffTwoArrayObject = function(arrayone,arraytwo)
    {
        var resultdiff = [];
        angular.forEach(arrayone, function(value,key) 
        {
            if (-1 === arraytwo.indexOf(value)) 
            {
              resultdiff.push(value);
            }
        });
        return resultdiff;
    }
    var UniqueObjectInArray = function(list) 
    {
        var resultunique = [];
        angular.forEach(list, function(value,key) 
        {
            if (-1 === resultunique.indexOf(value)) 
            {
              resultunique.push(value);
            }
        });
        return resultunique;
    }

    var UniqueObjectUnderscore = function(list,property) 
    {
        var uniqueList = _.uniq(list, function(item,key) 
        { 
            return item[property];
        });
        return uniqueList;
    }

   return {
        DiffTwoArrayObject:DiffTwoArrayObject,
        UniqueObjectInArray:UniqueObjectInArray,
        UniqueObjectUnderscore:UniqueObjectUnderscore

   }
});
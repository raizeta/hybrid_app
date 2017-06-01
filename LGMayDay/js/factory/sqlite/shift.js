angular.module('starter')
.factory('ShiftLiteFac',function($rootScope,$http, $q, $filter, $window,$cordovaSQLite,UtilService)
{
    var SetShift = function (datatosave)
    {
        var deferred        = $q.defer();
        var SHIFT_ID        = datatosave.SHIFT_ID;
        var SHIFT_DATE      = datatosave.SHIFT_DATE;
        var ACCESS_UNIX     = datatosave.ACCESS_UNIX;
        var OUTLET_CODE     = datatosave.OUTLET_CODE;
        var STATUS          = datatosave.STATUS;
        var CREATE_BY       = datatosave.CREATE_BY;
        var CREATE_AT       = datatosave.CREATE_AT;
        var UPDATE_BY       = datatosave.UPDATE_BY;
        var UPDATE_AT       = datatosave.UPDATE_AT;
        var IS_ONSERVER     = datatosave.IS_ONSERVER;

        var isitable            = [SHIFT_ID,SHIFT_DATE,ACCESS_UNIX,OUTLET_CODE,STATUS,CREATE_BY,CREATE_AT,UPDATE_BY,UPDATE_AT,IS_ONSERVER]
        var query               = 'INSERT INTO Tbl_Shift (SHIFT_ID,SHIFT_DATE,ACCESS_UNIX,OUTLET_CODE,STATUS,CREATE_BY,CREATE_AT,UPDATE_BY,UPDATE_AT,IS_ONSERVER) VALUES (?,?,?,?,?,?,?,?,?,?)';
        $cordovaSQLite.execute($rootScope.db,query,isitable)
        .then(function(result) 
        {
            deferred.resolve(result);
        },
        function (error)
        {
            deferred.reject(error);
        });
        return deferred.promise; 
    }

    var GetShift = function(SHIFT_DATE,ACCESS_UNIX,OUTLET_CODE)
    {
        var deferred                = $q.defer();
        var parameter               = [SHIFT_DATE,ACCESS_UNIX,OUTLET_CODE]
        var queryselectharga        = 'SELECT * FROM Tbl_Shift WHERE SHIFT_DATE= ? AND ACCESS_UNIX = ? AND OUTLET_CODE = ?';
        $cordovaSQLite.execute($rootScope.db,queryselectharga,parameter)
        .then(function(result) 
        {
            if(result.rows.length > 0)
            {
                var response = UtilService.SqliteToArray(result);
                deferred.resolve(response);
            }
            else
            {
                deferred.resolve([]);
            }
        },
        function (error)
        {
            deferred.reject(error); 
        });
        return deferred.promise; 
    }

    return{
            SetShift:SetShift,
            GetShift:GetShift
        }
});
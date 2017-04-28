angular.module('starter')
.factory('EmployeLiteFac',function($rootScope,$http, $q, $filter, $window,$cordovaSQLite,UtilService)
{
    var GetEmploye = function (OUTLET_CODE)
    {
        var deferred = $q.defer();
        var params   = [OUTLET_CODE];
        var queryselectstore = 'SELECT * FROM Tbl_Employe WHERE OUTLET_CODE = ?';
        $cordovaSQLite.execute($rootScope.db, queryselectstore,params)
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
    
    var SetEmploye = function (datatosave)
    {
        var deferred        = $q.defer();
        var ACCESS_UNIX     = datatosave.ACCESS_UNIX;
        var OUTLET_CODE     = datatosave.OUTLET_CODE;
        var EMP_ID          = datatosave.EMP_ID;
        var NAME            = datatosave.NAME;
        var EMP_KTP         = datatosave.EMP_KTP;
        var EMP_ALAMAT      = datatosave.EMP_ALAMAT;
        var EMP_GENDER      = datatosave.EMP_GENDER;
        var EMP_STS_NIKAH   = datatosave.EMP_STS_NIKAH;
        var EMP_TLP         = datatosave.EMP_TLP;
        var EMP_HP          = datatosave.EMP_HP;
        var EMP_EMAIL       = datatosave.EMP_EMAIL;
        var IS_ONSERVER     = datatosave.IS_ONSERVER;

        var isitable        = [ACCESS_UNIX,OUTLET_CODE,EMP_ID,NAME,EMP_KTP,EMP_ALAMAT,EMP_GENDER,EMP_STS_NIKAH,EMP_TLP,EMP_HP,EMP_EMAIL,IS_ONSERVER]
        var qinsertemploye  = 'INSERT INTO Tbl_Employe (ACCESS_UNIX,OUTLET_CODE,EMP_ID,NAME,EMP_KTP,EMP_ALAMAT,EMP_GENDER,EMP_STS_NIKAH,EMP_TLP,EMP_HP,EMP_EMAIL,IS_ONSERVER) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)';
        $cordovaSQLite.execute($rootScope.db,qinsertemploye,isitable)
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

    return{
            GetEmploye:GetEmploye,
            SetEmploye:SetEmploye
        }
});
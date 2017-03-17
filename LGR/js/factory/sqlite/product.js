angular.module('starter')
.factory('ProductLiteFac',function($rootScope,$http, $q, $filter, $window,$cordovaSQLite,UtilService)
{
    var GetPureProducts = function ()
    {
        var deferred = $q.defer();
        var queryselectproduct = 'SELECT * FROM Tbl_Product';
        $cordovaSQLite.execute($rootScope.db, queryselectproduct,[])
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

    var SetPureProduct = function (datatosave)
    {
        var deferred        = $q.defer();
        var ITEM_ID         = datatosave.ITEM_ID;
        var ITEM_NM         = datatosave.ITEM_NM;
        var STATUS          = datatosave.STATUS;
        var CREATE_BY       = datatosave.CREATE_BY;
        var UPDATE_BY       = datatosave.UPDATE_BY;
        var CREATE_AT       = datatosave.CREATE_AT;
        var UPDATE_AT       = datatosave.UPDATE_AT;
        var IMG64           = datatosave.IMG64;

        var isitable        = [ITEM_ID,ITEM_NM,STATUS,CREATE_BY,UPDATE_BY,CREATE_AT,UPDATE_AT,IMG64]
        var queryinsertproduct = 'INSERT INTO Tbl_Product (ITEM_ID,ITEM_NM,STATUS,CREATE_BY,UPDATE_BY,CREATE_AT,UPDATE_AT,IMG64) VALUES (?,?,?,?,?,?,?,?)';
        $cordovaSQLite.execute($rootScope.db,queryinsertproduct,isitable)
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

    var GetProductsGroup = function (OUTLET_ID)
    {
        var deferred = $q.defer();
        var queryselectproductgroup = 'SELECT * FROM Tbl_ItemGroup WHERE OUTLET_ID = ?';
        $cordovaSQLite.execute($rootScope.db, queryselectproductgroup,[OUTLET_ID])
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

    var SetProductsGroup = function (datatosave)
    {
        var deferred            = $q.defer();
        var OUTLET_ID           = datatosave.OUTLET_ID;
        var StoreNm             = datatosave.StoreNm;
        var LocateNm            = datatosave.LocateNm;
        var LocatesubNm         = datatosave.LocatesubNm;
        var ITEM_BARCODE        = datatosave.ITEM_BARCODE;
        var ItemNm              = datatosave.ItemNm;
        var GRP_DISPLAY         = datatosave.GRP_DISPLAY;

        var HPP                 = datatosave.HPP;
        var PERSEN_MARGIN       = datatosave.PERSEN_MARGIN;
        var STATUS              = datatosave.STATUS;
        var CREATE_AT           = datatosave.CREATE_AT;
        var UPDATE_AT           = datatosave.UPDATE_AT;
        var CREATE_BY           = datatosave.CREATE_BY;
        var UPDATE_BY           = datatosave.UPDATE_BY;
        var FORMULA_ID          = datatosave.FORMULA_ID;
        var FORMULA             = datatosave.formula;

        var isitable                = [OUTLET_ID,StoreNm,LocateNm,LocatesubNm,ITEM_BARCODE,ItemNm,GRP_DISPLAY,HPP,PERSEN_MARGIN,STATUS,CREATE_AT,UPDATE_AT,CREATE_BY,UPDATE_BY,FORMULA_ID,FORMULA]
        var queryinsertproductgroup = 'INSERT INTO Tbl_ItemGroup (OUTLET_ID,StoreNm,LocateNm,LocatesubNm,ITEM_BARCODE,ItemNm,GRP_DISPLAY,HPP,PERSEN_MARGIN,STATUS,CREATE_AT,UPDATE_AT,CREATE_BY,UPDATE_BY,FORMULA_ID,FORMULA) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
        $cordovaSQLite.execute($rootScope.db,queryinsertproductgroup,isitable)
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
            GetPureProducts:GetPureProducts,
            SetPureProduct:SetPureProduct,
            GetProductsGroup:GetProductsGroup,
            SetProductsGroup:SetProductsGroup
        }
});
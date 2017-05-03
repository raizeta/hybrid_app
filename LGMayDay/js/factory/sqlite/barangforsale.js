angular.module('starter')
.factory('BarangForSaleLiteFac',function($rootScope,$http, $q, $filter, $window,$cordovaSQLite,UtilService)
{
    var SetBarangForSale = function (datatosave)
    {
        var deferred            = $q.defer();
        var TGL_SAVE            = datatosave.TGL_SAVE;
        var OUTLET_CODE         = datatosave.OUTLET_CODE;
        var ITEM_ID             = datatosave.ITEM_ID;
        var ITEM_NM             = datatosave.ITEM_NM;
        var SATUAN              = datatosave.SATUAN;
        var DEFAULT_HARGA       = datatosave.DEFAULT_HARGA;
        var DEFAULT_STOCK       = datatosave.DEFAULT_STOCK;
        var DEFAULT_DISCOUNT    = datatosave.DEFAULT_DISCOUNT;
        var DEFAULT_IMAGE       = datatosave.DEFAULT_IMAGE;
        var UPDATE_AT           = datatosave.UPDATE_AT;
        var STATUS              = datatosave.STATUS;
        var IS_ONSERVER         = datatosave.IS_ONSERVER;

        var isitable            = [TGL_SAVE,OUTLET_CODE,ITEM_ID,ITEM_NM,SATUAN,DEFAULT_HARGA,DEFAULT_STOCK,DEFAULT_DISCOUNT,DEFAULT_IMAGE,UPDATE_AT,STATUS,IS_ONSERVER];
        var queryinsertbarangpenjualan  = 'INSERT INTO Tbl_BarangPenjualan (TGL_SAVE,OUTLET_CODE,ITEM_ID,ITEM_NM,SATUAN,DEFAULT_HARGA,DEFAULT_STOCK,DEFAULT_DISCOUNT,DEFAULT_IMAGE,UPDATE_AT,STATUS,IS_ONSERVER) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)';
        $cordovaSQLite.execute($rootScope.db,queryinsertbarangpenjualan,isitable)
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

    var GetBarangForSaleByDate = function (TGL_SAVE)
    {
        var deferred = $q.defer();
        var queryselectinvcheck = 'SELECT * FROM Tbl_BarangPenjualan WHERE TGL_SAVE = ? GROUP BY ITEM_ID';
        $cordovaSQLite.execute($rootScope.db,queryselectinvcheck,[TGL_SAVE])
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

    var GetBarangForSaleByDateAndCode = function (TGL_SAVE,OUTLET_CODE)
    {
        var deferred = $q.defer();
        var queryselectinvcheck = 'SELECT * FROM Tbl_BarangPenjualan WHERE TGL_SAVE = ? AND OUTLET_CODE = ? GROUP BY ITEM_ID';
        $cordovaSQLite.execute($rootScope.db,queryselectinvcheck,[TGL_SAVE,OUTLET_CODE])
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

    var GetBarangForSaleByDateAndItemID = function (TGL_SAVE,ITEM_ID)
    {
        var deferred = $q.defer();
        var queryselectinvcheck = 'SELECT * FROM Tbl_BarangPenjualan WHERE TGL_SAVE = ? AND ITEM_ID = ?';
        $cordovaSQLite.execute($rootScope.db,queryselectinvcheck,[TGL_SAVE,ITEM_ID])
        .then(function(result) 
        {
            if(result.rows.length > 0)
            {
                var response = UtilService.SqliteToArray(result);
                deferred.resolve(response[0]);
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

    var UpdateBarangForSaleByDateAndItem = function (dataupdate)
    {
        var deferred        = $q.defer();
        var DEFAULT_STOCK   = dataupdate.DEFAULT_STOCK;
        var TGL_SAVE        = dataupdate.TGL_SAVE;
        var ITEM_ID         = dataupdate.ITEM_ID;
        var isitable        = [DEFAULT_STOCK,TGL_SAVE,ITEM_ID];
        var queryupdatebarangforsale = 'UPDATE Tbl_BarangPenjualan SET DEFAULT_STOCK = ? WHERE TGL_SAVE = ? AND ITEM_ID = ?';
        $cordovaSQLite.execute($rootScope.db,queryupdatebarangforsale,isitable)
        .then(function(result) 
        {
            deferred.resolve(result);
        },
        function(error) 
        {
            deferred.reject(error);
        });
        return deferred.promise; 
    }

    return{
            SetBarangForSale:SetBarangForSale,
            GetBarangForSaleByDate:GetBarangForSaleByDate,
            GetBarangForSaleByDateAndCode:GetBarangForSaleByDateAndCode,
            GetBarangForSaleByDateAndItemID:GetBarangForSaleByDateAndItemID,
            UpdateBarangForSaleByDateAndItem:UpdateBarangForSaleByDateAndItem
        }
});
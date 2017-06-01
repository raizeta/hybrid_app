angular.module('starter')
.service('ConstructorService', function($q,$http,$filter,StorageService,UtilService) 
{
	var tanggalsekarang = $filter('date')(new Date(),'yyyy-MM-dd');
	var waktusekarang 	= $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');
  	var stores          = StorageService.get('LokasiStore');
    var profile         = StorageService.get('advanced-profile');

	var ProductConstructor = function(LAST_ITEMID)
	{
		var ITEM_ID               	= UtilService.StringPad(Number(LAST_ITEMID) + 1,'0000');
		var product 	= {};
		product.TGL_SAVE			= tanggalsekarang;
        product.OUTLET_CODE			= stores.OUTLET_CODE;
        product.ITEM_ID				= ITEM_ID;
        product.ITEM_NM				= null;
        product.SATUAN				= null;
        product.DEFAULT_HARGA		= null;
        product.DEFAULT_STOCK		= null;
        product.DEFAULT_DISCOUNT 	= 0;
        product.DEFAULT_IMAGE		= "img/bika-ambon.jpg";
        product.UPDATE_AT			= waktusekarang;
        product.STATUS				= 1;
        product.IS_ONSERVER			= 0;

        return product;
	}
	var CustomerConstructor = function()
	{
		var customer 				= {};
        customer.TGL_SAVE           = tanggalsekarang;
		customer.ACCESS_UNIX		= profile.ACCESS_GROUP;
        customer.OUTLET_CODE		= stores.OUTLET_CODE;
        customer.NAME				= null;
        customer.EMAIL				= null;
        customer.PHONE				= null;
        customer.CREATE_AT			= waktusekarang;
        customer.UPDATE_AT			= waktusekarang;
        customer.IS_ONSERVER		= 0;

        return customer;
	}
    var TransHeaderConstructor      = function(TRANS_ID)
    {
        var transheader = {};
        transheader.TRANS_DATE     = tanggalsekarang;
        transheader.TRANS_ID       = TRANS_ID;
        transheader.ACCESS_UNIX    = profile.ACCESS_UNIX;
        transheader.OUTLET_ID      = stores.OUTLET_CODE;
        transheader.STATUS         = 0;
        transheader.STATUS_BUY     = 'INCOMPLETE';
        transheader.CREATE_BY      = profile.ACCESS_UNIX;
        transheader.UPDATE_BY      = profile.ACCESS_UNIX;
        transheader.CREATE_AT      = waktusekarang;
        transheader.UPDATE_AT      = waktusekarang;
        transheader.IS_ONSERVER    = 0;

        return transheader;
    }
    var OpenBookConstructor     = function(SHIFT_ID)
    {
        var openbook    = {};
        openbook.TGL_CLOSE    = tanggalsekarang;
        openbook.SHIFT_ID     = profile.ACCESS_UNIX + stores.OUTLET_CODE + SHIFT_ID;
        openbook.ACCESS_UNIX  = profile.ACCESS_UNIX;
        openbook.OUTLET_CODE  = stores.OUTLET_CODE;
        openbook.CASHINDRAWER = 0;
        openbook.CHECKCASH    = 0;
        openbook.ADDCASH      = 0;
        openbook.SELLCASH     = 0;
        openbook.TOTALCASH    = 0;
        openbook.WITHDRAW     = 0;
        openbook.IS_OPEN      = 1;
        openbook.IS_CLOSE     = 0;
        openbook.IS_ONSERVER  = 0;
        openbook.status       = 'true';

        return openbook;
    }

    var SetoranConstructor     = function(nomorurut)
    {
        var setoran     = {};
        setoran.CLOSING_ID      = '2.' + stores.OUTLET_CODE + '.' + $filter('date')(new Date(),'yyyyMMdd') + '.' + nomorurut;
        setoran.ACCESS_UNIX     = profile.ACCESS_UNIX;
        setoran.STORAN_DATE     = tanggalsekarang;
        setoran.OUTLET_CODE     = stores.OUTLET_CODE;
        setoran.TTL_STORAN      = 0;
        setoran.IMG             = 'img/save-image.png';
        setoran.STATUS          = 0;
        setoran.CREATE_BY       = profile.ACCESS_UNIX;
        setoran.CREATE_AT       = waktusekarang;
        setoran.UPDATE_BY       = profile.ACCESS_UNIX;
        setoran.UPDATE_AT       = waktusekarang;
        setoran.IS_ONSERVER     = 0;

        return setoran;
    }

    var ShiftConstructor        = function()
    {
        var shift   = {};
        shift.SHIFT_ID      = '';
        shift.SHIFT_DATE    = tanggalsekarang;
        shift.ACCESS_UNIX   = profile.ACCESS_UNIX;
        shift.OUTLET_CODE   = stores.OUTLET_CODE;
        shift.STATUS        = 0;
        shift.CREATE_BY     = profile.ACCESS_UNIX;
        shift.CREATE_AT     = waktusekarang;
        shift.UPDATE_BY     = profile.ACCESS_UNIX;
        shift.UPDATE_AT     = waktusekarang;
        shift.IS_ONSERVER   = 0;

        return shift
    }
	return{
			ProductConstructor:ProductConstructor,
			CustomerConstructor:CustomerConstructor,
            TransHeaderConstructor:TransHeaderConstructor,
            OpenBookConstructor:OpenBookConstructor,
            SetoranConstructor:SetoranConstructor
		  }
});
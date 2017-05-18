angular.module('starter')
.service('UtilService', function($q,$http,$filter,StorageService) 
{
    var ApiUrl = function()
    {
      return "http://api.lukisongroup.com/";
      // return "http://api.kontrolgampang.com/";
    }
    
    var ArrayChunk = function (arr, size) 
    {
      var newArr = [];
      for (var i=0; i<arr.length; i+=size) 
      {
        newArr.push(arr.slice(i, i+size));
      }
      return newArr;
    }

    var SerializeObject = function (objecttoserialize) 
    {
        var resultobjecttoserialize = {};
        function serializeObj(obj) 
        {
            // var result = [];
            // for (var property in obj) 
            // {
            //   result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));
            // }
            // return result.join("&");

            var str = [];
            for (var key in obj) 
            {
                if (obj[key] instanceof Array) 
                {
                    for(var idx in obj[key])
                    {
                        var subObj = obj[key][idx];
                        for(var subKey in subObj)
                        {
                            str.push(encodeURIComponent(key) + "[" + idx + "][" + encodeURIComponent(subKey) + "]=" + encodeURIComponent(subObj[subKey]));
                        }
                    }
                }
                else 
                {
                    str.push(encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]));
                }
            }
            return str.join("&");
        }
        
        var serialized = serializeObj(objecttoserialize); 
        var config = 
        {
            headers : 
            {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded;application/json;charset=utf-8;'   
            }
        };
        resultobjecttoserialize.serialized   = serialized;
        resultobjecttoserialize.config       = config;

        return resultobjecttoserialize;
    }

    var SumPriceQtyWithCondition = function(items,price,qty,condition)
    {
        return items.reduce( function(a, b)
        {
            if(b[condition] == true)
            {
              if(b[price] == undefined || b[qty] == undefined)
              {
                  return a + 0;
              }
              else
              {
                  return a + (b[price] * b[qty]);
              }
            }
            else
            {
                return a + 0;
            }
            
        }, 0);
    }
    var SumPriceWithQty = function(items,price,qty)
    {
        return items.reduce( function(a, b)
        {
            if(b[price] == undefined || b[qty] == undefined)
            {
                return a + 0;
            }
            else
            {
                return a + (b[price] * b[qty]);
            }
        }, 0);
    }
    var SumJustPriceOrQty = function(items, price)
    {
        return items.reduce( function(a, b)
        {
            if(b[price] == undefined)
            {
                return a + 0;
            }
            else
            {
                return a + b[price];
            }
        }, 0);
    }
    var JarakDuaTitik = function(longitude1,latitude1,longitude2,latitude2)
    {
        var thetalong      = (longitude1 - longitude2)*(Math.PI / 180); 
        var thetalat       = (latitude1 - latitude2)*(Math.PI / 180);
        var a = 0.5 - Math.cos(thetalat)/2 + Math.cos(latitude1 * Math.PI / 180) * Math.cos(latitude2 * Math.PI / 180) * (1 - Math.cos(thetalong))/2;
        var jarak = 12742 * Math.asin(Math.sqrt(a)) * 1000;
        return jarak;
    }

    var getTotalHariDalamSebulan = function(tanggalplan)
    {
      var date    = new Date(tanggalplan);
      var year    = date.getFullYear();
      var month   = date.getMonth() + 1;
      return new Date(year,month,0).getDate(); 
    }
    var SqliteToArray = function(sqliteresult)
    {
    	var panjang = sqliteresult.rows.length;
    	var response = [];
  		for(var i=0; i < panjang; i++)
  		{
  			response.push(sqliteresult.rows.item(i));
  		}
		  return response;
    }

    var SetGambarCheckinCheckout = function(dataagenda)
    {
        var datadariagenda = dataagenda;
        var databaru = [];
        angular.forEach(datadariagenda, function(value, key) 
        {
            if(value.CHECKIN_TIME)
            {
               if(value.CHECKOUT_TIME)
               {
                  value.imagecheckout = "asset/admin/dist/img/customer.jpg";
                  value.STSCHECK_IN   = 1;
                  value.STSCHECK_OUT  = 1;
               }
               else
               {
                  value.imagecheckout = "asset/admin/dist/img/customerlogo.jpg";
                  value.STSCHECK_IN   = 1;
                  value.STSCHECK_OUT  = 0;
               }
            }
            else
            {
               if(value.CHECKOUT_TIME)
               {
                  value.imagecheckout = "asset/admin/dist/img/customer.jpg";
                  value.STSCHECK_IN   = 1;
                  value.STSCHECK_OUT  = 1;
               }
               else
               {
                  value.imagecheckout = "asset/admin/dist/img/normal.jpg";
                  value.STSCHECK_IN   = 0;
                  value.STSCHECK_OUT  = 0;
               }
            }
            databaru.push(value);
        });
        return databaru;
    }

    var DiffTwoDateTime = function(datetime1,datetime2) 
    {
        var duration = Math.abs( new Date(datetime1) - new Date(datetime2) );
        var milliseconds = parseInt((duration%1000)/100)
            , seconds = parseInt((duration/1000)%60)
            , minutes = parseInt((duration/(1000*60))%60)
            , hours = parseInt((duration/(1000*60*60))%24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return hours + ":" + minutes + ":" + seconds;
    }

    var StringPad   = function(stringtopad,pad) 
    {
        var stringtopad = "" + stringtopad;
        var ans = pad.substring(0, pad.length - stringtopad.length) + stringtopad;
        return ans;
    };

    var CameraOptions = function()
    {
        
        var options = {};
        options.quality             = 50;
        options.destinationType     = Camera.DestinationType.DATA_URL;
        options.sourceType          = Camera.PictureSourceType.CAMERA;
        options.allowEdit           = false;
        options.encodingType        = Camera.EncodingType.JPEG;
        options.targetWidth         = 500;
        options.targetHeight        = 500;
        options.popoverOptions      = CameraPopoverOptions;
        options.saveToPhotoAlbum    = false;
        options.correctOrientation  = true;
        return options;
    }

    var PembayaranFunc = function(totalpembayaran)
    {
        var yangdibayarkan      = [{'yangdibayar':totalpembayaran}]
        var berapakalidibagi1   = Math.floor(totalpembayaran / 1000);
        var berapakalidibagi2   = Math.floor(totalpembayaran / 2000);
        var berapakalidibagi3   = Math.floor(totalpembayaran / 5000);

        var sisabagi1           = Math.floor(totalpembayaran % 1000);
        var sisabagi2           = Math.floor(totalpembayaran % 2000);
        var sisabagi3           = Math.floor(totalpembayaran % 5000);

        var hasilbagi1          = (berapakalidibagi1 + 1) * 1000;
        var hasilbagi2          = (berapakalidibagi2 + 1) * 2000;
        var hasilbagi3          = (berapakalidibagi3 + 1) * 5000;

        var indexhasilbagi1         = _.findIndex(yangdibayarkan,{'yangdibayar':hasilbagi1});
        
    
        if(indexhasilbagi1 == -1)
        {
            yangdibayarkan.push({'yangdibayar': hasilbagi1});    
        }
        var indexhasilbagi2         = _.findIndex(yangdibayarkan,{'yangdibayar':hasilbagi2});
        if(indexhasilbagi2 == -1)
        {
            yangdibayarkan.push({'yangdibayar': hasilbagi2});    
        }
        var indexhasilbagi3         = _.findIndex(yangdibayarkan,{'yangdibayar':hasilbagi3});
        if(indexhasilbagi3 == -1)
        {
            yangdibayarkan.push({'yangdibayar': hasilbagi3});    
        }
        return yangdibayarkan;
    }

    var GenerateNomorTrans  = function(responselite,ACCESS_UNIX,OUTLET_CODE)
    {
        var datacustrans  = {};
        if(responselite.length > 0)
        {
            var lastbookingserialnumber     = responselite[responselite.length - 1].TRANS_ID;
            var lastthree                   = lastbookingserialnumber.substr(lastbookingserialnumber.length - 3);
            var nomorurut                   = StringPad(Number(lastthree) + 1,'000');
            datacustrans.TRANS_ID           = ACCESS_UNIX + '.' + OUTLET_CODE + '.' +$filter('date')(new Date(),'yyyyMMdd') + nomorurut; 
        }
        else
        {
            datacustrans.TRANS_ID           = ACCESS_UNIX + '.' + OUTLET_CODE + '.' + $filter('date')(new Date(),'yyyyMMdd') + '001';
        }
        
        StorageService.set('TRANS-ACTIVE',datacustrans.TRANS_ID);
        return datacustrans.TRANS_ID;
    }
    
    var GetRatingConfig = function()
    {
        var ratingconfig = {};
        ratingconfig.iconOn       = 'ion-ios-star';
        ratingconfig.iconOff      = 'ion-ios-star-outline';
        ratingconfig.iconOnColor  = 'rgb(200, 200, 100)';
        ratingconfig.iconOffColor = 'rgb(200, 100, 100)';
        ratingconfig.rating       = 0;
        ratingconfig.minRating    = 0;
        ratingconfig.readOnly     = false;
        return ratingconfig;
    }
    return {
      ArrayChunk:ArrayChunk,
      ApiUrl:ApiUrl,
      SumPriceQtyWithCondition:SumPriceQtyWithCondition,
      SerializeObject:SerializeObject,
      SumPriceWithQty:SumPriceWithQty,
      SumJustPriceOrQty:SumJustPriceOrQty,
      JarakDuaTitik:JarakDuaTitik,
      getTotalHariDalamSebulan:getTotalHariDalamSebulan,
      SqliteToArray:SqliteToArray,
      SetGambarCheckinCheckout:SetGambarCheckinCheckout,
      DiffTwoDateTime:DiffTwoDateTime,
      StringPad:StringPad,
      CameraOptions:CameraOptions,
      PembayaranFunc:PembayaranFunc,
      GenerateNomorTrans:GenerateNomorTrans,
      GetRatingConfig:GetRatingConfig
    };
});
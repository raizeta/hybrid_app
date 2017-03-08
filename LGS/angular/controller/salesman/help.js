'use strict';
myAppModule.controller("HelpController", ["$rootScope","$scope", "$location","$http","auth","$window","ModalService","$filter","Datetimecountdown","Util","$interval", 
function ($rootScope,$scope, $location, $http,auth,$window,ModalService,$filter,Datetimecountdown,Util,$interval) 
{   
    $scope.activehelp  = "active";
    $scope.userInfo = auth;
	$scope.logout = function () 
    { 
        $scope.userInfo = null;
        $window.sessionStorage.clear();
        window.location.href = "index.html";
    }
    $scope.oneAtATime = true;
    $scope.status = {isFirstOpen: true,isFirstDisabled: false};

	$scope.myInterval = 5000;
	$scope.noWrapSlides = true;
	$scope.active = 0;
	var slides = $scope.slides = [];
	var currIndex = 0;

	$scope.addSlide = function() 
	{
		slides.push
		(
		    {
		      image: 'asset/help/1.Login.png',
		      text: 'Silahkan Login Dengan Username Dana Password Anda. Untuk Penggantian Atau Lupa Password Hubungi Dept IT',
		      id: currIndex++
		    },
		    {
		      image: 'asset/help/1a.User Login Salah.png',
		      text: 'Pesan Akan Keluar Jika Username Atau Password Salah',
		      id: currIndex++
		    },
		    {
		      image: 'asset/help/1b.User Login Benar.png',
		      text: 'Proses Login Berjalan Normal. Jika Sebelumnya Anda Belum Melakukan Absensi, Maka Anda Akan Diminta Untuk Melakukan Absensi Terlebih Dahulu',
		      id: currIndex++
		    },
		    {
		      image: 'asset/help/2.Absensi Masuk.png',
		      text: 'Silahkan Melakukan Absensi Dengan Menekan Tombol Berwarna Hijau',
		      id: currIndex++
		    },
		    {
		      image: 'asset/help/3.Menu Absensi Masuk.png',
		      text: 'Jika Absensi Sukses,Maka Anda Akan Ditujukan Ke Menu Agenda Today',
		      id: currIndex++
		    },
		    {
		      image: 'asset/help/4.Menu Agenda Today-2.png',
		      text: 'Ini adalah Menu Agenda Today Yang Berisi List Customer Yang Harus Anda Kunjungi Pada Hari Ini, Customer Telah Diurutkan Berdasarkan Jarak Terdekat Dengan Anda',
		      id: currIndex++
		    },
		    {
		      image: 'asset/help/5.Menu Agenda Today-3.png',
		      text: 'Ini adalah Peta Customer Yang Harus Anda Kunjungi',
		      id: currIndex++
		    },
		    {
		      image: 'asset/help/6.Menu Agenda Today-4.png',
		      text: 'Disini Akan Berisi Summary Inventory Stock Dari Setiap Customer Yang Anda Kunjungi.',
		      id: currIndex++
		    },
		    {
		      image: 'asset/help/7.Menu Agenda Today-5.png',
		      text: 'Disini Akan Berisi Daftar Waktu Check-in Dari Setiap Customer Yang Anda Kunjungi.',
		      id: currIndex++
		    },
		    {
		      image: 'asset/help/8.Menu Agenda Today-6.png',
		      text: 'Masih Pada Menu Yang Sama Ini adalah Daftar Waktu Check-out Anda Dari Setiap Customer Yang Anda Kunjungi.',
		      id: currIndex++
		    },
		    {
		      image: 'asset/help/4.Menu Agenda Today-2.png',
		      text: 'Next Step.Pilih Salah Satu Customer Pada List Customer Agenda Today Yang Memiliki Jarak Terdekat. Check-in Ke Customer Dapat Dilakukan Jika Jarak Anda Dengan Customer Tersebut Tidak Lebih Besar Dari 100 meter',
		      id: currIndex++
		    },
		    {
		      image: 'asset/help/9.Menu Detail Kunjungan-1.png',
		      text: 'Jika Check-in Berhasil Anda Akan Masuk Pada Menu Detail Kunjungan. Pada Menu Ini Terdapat Inventory, Map Customer, Summary, Summary Terakhir Kunjungan. Ini Adalah Menu Inventory',
		      id: currIndex++
		    },
		    {
		      image: 'asset/help/9b.In Radius.png',
		      text: 'Ini Adalah Peta Customer Yang Anda Kunjungi. Jika Anda Berada Di Lingkarang Merah, Ini Menandakan Bahwa Anda Di Dalam Radius Dari Customer Tersebut, dan Sebaliknya',
		      id: currIndex++
		    },
		    {
		      image: 'asset/help/9c.Summary Empty.png',
		      text: 'Ini Adalah Menu Detail Inventory Per Customer, Jika Anda Belum Melakukan Inventory Maka Ini Akan Kosong',
		      id: currIndex++
		    },
		    {
		      image: 'asset/help/9.Menu Detail Kunjungan-1.png',
		      text: 'Kembali Ke Menu Inventory. Pada Menu Ini Terdapat Start Picture, Stock Inventory, Sell Out Inventory, Sell In Inventory, Return Inventory, Expired Iventory, Note Kunjungan Dan Check-out Menu. NB: Setiap Action Pada Menu Ini Dapat Dilakukan Jika Anda Berada Pada Radius Yang Tidak Lebih Dari 100 meter',
		      id: currIndex++
		    },
		    {
		      image: 'asset/help/10.Menu Detail Kunjungan-2.png',
		      text: 'Ini Adalah Menu Stock Inventory, Click Pada Salah Satu Gambar Product Yang Terdapat Pada Menu Ini, Kemudian Isikan Jumlah Product Dalam Pcs, Kemudian Klik Ok. Jika Quantity Product Berhasil Di Kirim Ke Server, Maka List Product Stock Inventory Akan Hilang Dari List Stock Inventory Menu',
		      id: currIndex++
		    },
		    {
		      image: 'asset/help/11.Menu Detail Kunjungan-3.png',
		      text: 'Lakukan Langkah Sebelumnya Untuk Melakukan Stock Inventory, Sampai List Product Pada Inventory Stock Ini Habis Semua',
		      id: currIndex++
		    },
		    {
		      image: 'asset/help/12.Menu Detail Kunjungan-4.png',
		      text: 'Jika Anda Telah Melakukan Stock Inventory Sampai Finish, Maka Akan Muncul Notifikasi Bahwa Action Stock Inventory Telah Berhasil Dilakukan, Perhatikan Background Pada Menu Stock Quantity Telah Berganti Menjadi Hijau',
		      id: currIndex++
		    },
		    {
		      image: 'asset/help/13.Menu Detail Kunjungan-5.png',
		      text: 'Next Step, Lakukan Action Menu Sell Out Inventory. Langkah-langkahnya sama dengan melakukan Stock Inventory',
		      id: currIndex++
		    },
		    {
		      image: 'asset/help/14.Menu Detail Kunjungan-6.png',
		      text: 'Langkah-langkahnya sama dengan melakukan Stock Inventory',
		      id: currIndex++
		    },
		    {
		      image: 'asset/help/15.Menu Detail Kunjungan-7.png',
		      text: 'Langkah-langkahnya sama dengan melakukan Stock Inventory',
		      id: currIndex++
		    },
		    {
		      image: 'asset/help/15.Menu Detail Kunjungan-7.png',
		      text: 'Next Step. Lakukan Action Sell In Inventory. Langkah-langkahnya sama dengan melakukan Stock Inventory ',
		      id: currIndex++
		    },
		    {
		      image: 'asset/help/17.Menu Detail Kunjungan-9.png',
		      text: 'Langkah-langkahnya sama dengan melakukan Stock Inventory ',
		      id: currIndex++
		    },
		    {
		      image: 'asset/help/18.Menu Detail Kunjungan-10.png',
		      text: 'Langkah-langkahnya sama dengan melakukan Stock Inventory ',
		      id: currIndex++
		    },
		    {
		      image: 'asset/help/19.Menu Detail Kunjungan-11.png',
		      text: 'Next Step. Lakukan Action Expired Inventory. Click Pada Salah Satu Gambar Product Yang Terdapat Pada Menu Ini Untuk Menampilkan Form Isian Expired Inventory',
		      id: currIndex++
		    },
		    {
		      image: 'asset/help/20.Menu Detail Kunjungan-12.png',
		      text: 'Isi nilai/jumlah product expired untuk setiap prioritas expired.',
		      id: currIndex++
		    },
		    {
		      image: 'asset/help/21.Menu Detail Kunjungan-13.png',
		      text: 'Lakukan langkah ini untuk setiap product yang ada di list sampai action ini complete',
		      id: currIndex++
		    },
		    {
		      image: 'asset/help/22.Menu Detail Kunjungan-14.png',
		      text: 'Jika Action Product Expired Telah Complete, Maka Action Background Akan Berganti Menjadi Hijau',
		      id: currIndex++
		    },
		    {
		      image: 'asset/help/23.Menu Detail Kunjungan-15.png',
		      text: 'Next Step. Masukkan Nota Kunjungan. Nota Ini Berisi Keluhan, Pesan, Catatan Penting Dari Customer',
		      id: currIndex++
		    },
		    {
		      image: 'asset/help/24.Menu Detail Kunjungan-16.png',
		      text: 'Isikan Catatan Tersebut Pada Media Yang Telah Disediakan. Jika Anda Sudah Merasa Complete Klik Tombol Submit, Tunggu Sampai Ada Notifikasi Bahwa Nota Telah Disimpan',
		      id: currIndex++
		    },
		    {
		      image: 'asset/help/25.Menu Detail Kunjungan-17.png',
		      text: 'Ini Adalah Notifikasi Yang Memberitahukan Bahwa Nota Telah Berhasi di Simpan',
		      id: currIndex++
		    },
		    {
		      image: 'asset/help/26.Menu Detail Kunjungan-18.png',
		      text: 'Next Step.Sebelum Anda Melakukan Checkout Pastikan Bahwa Semua Action Telah Complete, Klik Menu Summary Untuk Memastikan Bahwa Semua Data Telah Masuk',
		      id: currIndex++
		    },
		    {
		      image: 'asset/help/27.Menu Detail Kunjungan-19.png',
		      text: 'Lanjutan Dari Langkah Sebelumnya',
		      id: currIndex++
		    },
		    {
		      image: 'asset/help/28.Menu Detail Kunjungan-20.png',
		      text: 'Next Step.Jika Semua Berjalan Dengan Baik, Kembali Ke Menu Customer Dan Tekan Tomblok Check Out, Anda Diminta Untuk Memastikan Bahwa Anda Akan Melakukan Check Out. Jika Anda Yakin Tekan Tombol Yes',
		      id: currIndex++
		    },
		    {
		      image: 'asset/help/29.Berhasil Check Out.png',
		      text: 'Next Step. Tunggu Konfirmasi Bahwa Anda Telah Berhasil Melakukan Check Out, Seperti Gambar Di Atas',
		      id: currIndex++
		    },
		    {
		      image: 'asset/help/30.Menu Detail Kunjungan-21.png',
		      text: 'Next Step. Anda Akan Kembali Ke Menu List Customer Visit Pada Hari Ini, Perhatikan Garis Berwarna Biru, Itu Adalah Persentasi Dari Action Yang Telah Anda Lakukan',
		      id: currIndex++
		    }
		);
	};

	$scope.addSlide();
	$scope.tanggalkurang 		= 'radumta';

	$scope.showmodal = function(barang,index) 
    {
        ModalService
        .showModal(
        {
          templateUrl: "angular/partial/salesman/estimasimodal.html",
          controller: "EstimasiController",
          inputs: 
          {
            title: 'Estimasi Lama Kunjungan'
          }
        })
        .then(function(modal) 
        {
            modal.element.modal(function ()
            {
                alert("Button OK Klick");
            });
            modal.close.then(function(result) 
            {
            	var waktumasuk  = result.list[0].waktumasuk;

            	var lamajam		= result.list[0].jam;
            	var lamamenit	= result.list[0].menit;

            	var tahunmasuk 		= $filter('date')(waktumasuk,'yyyy');
            	var bulanmasuk 		= $filter('date')(waktumasuk,'MM');
            	var tanggalmasuk    = $filter('date')(waktumasuk,'dd');
            	var jammasuk 		= $filter('date')(waktumasuk,'HH');
    			var menitmasuk 		= $filter('date')(waktumasuk,'mm');

    			var hitungmenit = parseInt(lamamenit) + parseInt(menitmasuk);
    			var hitungjam  	= parseInt(jammasuk) + parseInt(lamajam);

    			var waktukeluar = new Date(tahunmasuk,bulanmasuk - 1,tanggalmasuk,0,0,0);
            	if(hitungmenit / 60 > 1)
            	{
            		var jamx 		= hitungjam + 1;
            		var menitx 		= hitungmenit % 60;
            		waktukeluar.setHours(jamx);
            		waktukeluar.setMinutes(menitx );
            	}
            	else
            	{
            		waktukeluar.setHours(hitungjam);
            		waktukeluar.setMinutes(hitungmenit);
            	}
            	console.log($filter('date')(waktukeluar,'yyyy-MM-dd HH:mm:ss'));
            });
        });   
    };

    var future = new Date(2016,9-1,13,19,31,0);
    var stop = $interval(function () 
    {
        var diff;
        diff = Math.floor((future.getTime() - new Date().getTime()) / 1000);
        $scope.countdown = $rootScope.convertwaktu(diff);
        if(diff < 1)
        {
        	$scope.stopFight();
        }
    }, 1000);
	$scope.stopFight = function() 
	{
          if (angular.isDefined(stop)) 
          {
            $interval.cancel(stop);
            stop = undefined;
          }
    };
}]);

myAppModule.controller('EstimasiController', ['$rootScope','$scope', '$http','$element', 'title', 'close',"$filter",
function($rootScope,$scope, $http,$element, title, close,$filter) 
{
   $scope.title = title;
    var myDate 		= new Date();
    var tahun 		= $filter('date')(myDate,'yyyy');
    var bulan 		= $filter('date')(myDate,'MM');
    var tanggal 	= $filter('date')(myDate,'dd');
    var jam 		= $filter('date')(myDate,'HH');
    var menit 		= $filter('date')(myDate,'mm');

	$scope.list = [];
    var result = {};
    result.waktumasuk  = new Date();
    result.jam 			= 0;
    result.menit 		= 30;
    $scope.list.push(result);

	$scope.close = function() 
	{
	    close({list:$scope.list,title:$scope.title}, 500); // close, but give 500ms for bootstrap to animate
	};

	$scope.cancel = function() 
	{
		$element.modal('hide');
	};

	$scope.qtychange = function()
	{
		alert("radumta");
	}
}]);




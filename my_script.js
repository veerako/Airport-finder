var app1 = angular.module('app1', []);

app1.controller('ctrl1', function($scope) {

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else { 
    $scope.lon = position.coords.longitude;
    $scope.lat = position.coords.latitude;
  }
  
  function showPosition(position) {
    $scope.lon = position.coords.longitude;
    $scope.lat = position.coords.latitude;
  }

  
  $scope.total_rows = 0;
  $itration = 1;
  var data_all = [];

  $scope.lat_r = 12;
  $scope.lon_r = 12;
  $scope.radius = 500;

  $scope.lat_stick = $scope.lat_r*5;
  $scope.lon_stick = $scope.lon_r*5;

  if($scope.lat_stick > 325){
    $scope.lat_stick = 325;
  }

  $scope.rangefinder = function(target) {
    $scope.$apply(function () {
      $scope.radius = target;
    });
  };

  $scope.addValue = function(a,b) {
    $scope[b] = (+a + 2.5);
    if($scope[b]*5 <= 220){
      if(b == 'lat_r'){ c = 'lat_stick';}else{ c = 'lon_stick';}
      $scope[c] = $scope[b]*5;
    }
  };

  $scope.subValue = function(a,b) {
    if(a > 0){
      $scope[b] = (+a - 2.5);
      if($scope[b]*5 <= 220){
        if(b == 'lat_r'){ c = 'lat_stick';}else{ c = 'lon_stick';}
        $scope[c] = $scope[b]*5;
      }
    }
  };

  $scope.addRadius = function(a,b) {
    $scope[b] = (+a + 1);
  };

  $scope.subRadius = function(a,b) {
    $scope[b] = (+a - 1);
  };

  $scope.getValue = function(flag) {  
    if(flag == 'new'){
      delete $scope.bookmark;
      data_all = [];
      $itration = 1;
    }
    if($scope.lon){
      navigator.geolocation.getCurrentPosition(showPosition);
    }
    $.ajax({
      url : 'api.php',
      type : 'GET',
      data : {
          'lon' : $scope.lon,
          'lat' : $scope.lat,
          'lon_range': $scope.lat_r,
          'lat_range': $scope.lon_r,
          'bookmark': $scope.bookmark,
        },
      dataType:'json',
      success : function(data) {  
        if(flag == 'new'){
          data_all = data.rows;
        } else {
          data_all.push.apply(data_all,data.rows);
        }      
        if(data.total_rows > 25*$itration){
          $scope.$apply(function () {
            $scope.bookmark = data.bookmark;
          });
          $itration++;
          $scope.getValue('old');
        } else {
          data_all.sort(function(a, b){ return a.fields.miles - b.fields.miles;});
          $scope.assign(data,data_all);
        }
      },
      error : function(request,error)
      {
        alert("Request: "+JSON.stringify(request));
      }
    });

    $("#listing").show();
  };
    

  $scope.airport_name = '';
  $scope.airport_distance = '';

  $scope.assign = function(data,data_all) {
    $scope.$apply(function () {
      $scope.total_rows = data.total_rows;
      $scope.data_all = data_all;
    });
  };

});
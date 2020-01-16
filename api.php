<?php  

require_once('functions.php');
$lon = new stdClass();
$lat = new stdClass();

$lon->user = $_REQUEST['lon'];
$lat->user = $_REQUEST['lat'];

$lon->low = $_REQUEST['lon']-$_REQUEST['lon_range'];; 
$lon->high = $_REQUEST['lon']+$_REQUEST['lon_range'];; 

$lat->low = $_REQUEST['lat']-$_REQUEST['lat_range']; 
$lat->high = $_REQUEST['lat']+$_REQUEST['lat_range'];

$lon_range = $lon->low." TO ".$lon->high;
$lat_range = $lat->low." TO ".$lat->high;
$url = "https://mikerhodes.cloudant.com/airportdb/_design/view1/_search/geo?";
$url .= "q=lon:[".rawurlencode($lon_range)."]%20AND%20lat:[".rawurlencode($lat_range)."]"; 

if(isset($_REQUEST['bookmark'])){
    $url .= "&bookmark=".$_REQUEST['bookmark'];
}

$ch = curl_init();  
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 
curl_setopt($ch, CURLOPT_URL, $url); 
$result = curl_exec($ch); 

$r = json_decode($result);

$rows = $r->rows;
foreach ($rows as $a){
    $a->fields->miles= distance($lat->user, $lon->user, $a->fields->lat, $a->fields->lon);
}

$new_result = json_encode($r);
print_r($new_result);

?>

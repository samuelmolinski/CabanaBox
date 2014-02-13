<?php
$filepath = $_POST['src'];
$valor = $_POST['valor'];
$msg = $_POST['msg'];
$timestamp = time();
$rand = mt_rand();
$name = 'picToShare'.$timestamp.'_'.$rand.'.png';
file_put_contents($name,file_get_contents("data://".$filepath));
////////

require 'facebook-php-sdk/src/facebook.php';

$config = array();
//dummy pablo
//$config['appId'] = '448305385283158';
//$config['secret'] = 'cb3788045112d439b292f32b59746346';
//official
$config['appId'] = '218922784940536';
$config['secret'] = '48349dd6cef027b5f8e2c52606fbd7a8';
//
$config['cookie'] = true;
$facebook = new Facebook($config);
$facebook->setFileUploadSupport(true);
//
$authToken = $facebook->getAccessToken();

$baseURL = "https://graph.facebook.com/me/photos?access_token=";
$finalURL = $baseURL.$authToken;

// Open the Curl session
$session = curl_init($finalURL);

$post_array = array(
        "source" =>"@". realpath($name),
        "message"=>$msg
);
	
$options = array(
	CURLOPT_RETURNTRANSFER => true,
	CURLOPT_HTTPHEADER => array('Host: graph.facebook.com') ,
	CURLOPT_SSL_VERIFYPEER => false,
	CURLOPT_BINARYTRANSFER => true,
	CURLOPT_POST => true,
	CURLOPT_POSTFIELDS => $post_array //works
);

curl_setopt_array( $session, $options );

// Make the call
$FBreturn = curl_exec($session);

// The web service returns json. Set the Content-Type appropriately
header("Content-Type: application/json");

echo $FBreturn;
curl_close($session);
unlink($name);
?>
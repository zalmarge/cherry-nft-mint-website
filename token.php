<?php

$payload = [

  'exp' => strtotime('+ 8 HOURS'),

  'pub_key_id' => '131ff17d-5090-11ef-800a-0242ac120002'

];



$privateKeySecret = 'cherry';

$privateKey = file_get_contents('private.pem');

$privateKey = openssl_pkey_get_private($privateKey, $privateKeySecret);

$token = jwtRS256Encode($payload, $privateKey);

echo $token . PHP_EOL;



function jwtRS256Encode(array $payload, $key): string {

   $header = [

       'typ' => 'JWT',

       'alg' => 'RS256'

   ];



   $header = base64UrlEncode(json_encode($header));

   $payload = base64UrlEncode(json_encode($payload));

   $data = $header . '.' . $payload;

   openssl_sign($data, $signature, $key, OPENSSL_ALGO_SHA256);

   $signature = base64UrlEncode($signature);

   return $data . '.' . $signature;

}



function base64UrlEncode(string $text): string {

   return str_replace(

      ['+', '/', '='],

       ['-', '_', ''],

       base64_encode($text)

   );

}
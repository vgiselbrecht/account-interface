<?php

header("Content-Type: application/json; charset=utf-8");

$url = "http://api.account.local" . substr($_SERVER['PHP_SELF'], 10);

$fields_string = "";

foreach ($_POST as $key => $value) {
    $fields_string .= $key . '=' . urlencode($value) . '&';
}
rtrim($fields_string, '&');

$ch = curl_init();

curl_setopt($ch,CURLOPT_URL, $url);
curl_setopt($ch,CURLOPT_POST, count($_POST));
curl_setopt($ch,CURLOPT_POSTFIELDS, $fields_string);

echo rtrim(curl_exec($ch),"1");

curl_close($ch);
?>
<?php
// http.php — peticiones HTTPS. Usa cURL si está activo y, si no, los "streams" de PHP (requiere la extensión openssl).
function http_cafile() {
  foreach ([ini_get('openssl.cafile'), ini_get('curl.cainfo'), 'C:/xampp/apache/bin/curl-ca-bundle.crt', 'C:/xampp/php/extras/ssl/cacert.pem', '/etc/ssl/certs/ca-certificates.crt'] as $f) {
    if (is_string($f) && $f !== '' && @is_file($f)) { return $f; }
  }
  return '';
}
function http_request($method, $url, $headers = [], $body = null, $timeout = 30) {
  if (function_exists('curl_init')) {
    $ch = curl_init($url);
    $opts = [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => $timeout, CURLOPT_HTTPHEADER => $headers, CURLOPT_CUSTOMREQUEST => $method];
    if ($body !== null) { $opts[CURLOPT_POSTFIELDS] = $body; }
    curl_setopt_array($ch, $opts);
    $resp = curl_exec($ch);
    $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err  = curl_error($ch);
    return [$resp, $code, $err];
  }
  if (!extension_loaded('openssl')) { return [false, 0, 'ni cURL ni openssl estan activos en PHP']; }
  $http = ['method' => $method, 'header' => implode("\r\n", $headers), 'timeout' => $timeout, 'ignore_errors' => true];
  if ($body !== null) { $http['content'] = $body; }
  $ssl = ['verify_peer' => true, 'verify_peer_name' => true];
  $ca = http_cafile();
  if ($ca !== '') { $ssl['cafile'] = $ca; }
  $ctx = stream_context_create(['http' => $http, 'ssl' => $ssl]);
  $resp = @file_get_contents($url, false, $ctx);
  $hdrs = function_exists('http_get_last_response_headers') ? http_get_last_response_headers() : (isset($http_response_header) ? $http_response_header : []);
  $code = 0;
  if (is_array($hdrs) && isset($hdrs[0]) && preg_match('#\s(\d{3})(\s|$)#', $hdrs[0], $m)) { $code = (int) $m[1]; }
  $err = '';
  if ($resp === false) { $e = error_get_last(); $err = 'conexion por streams fallo' . ($e ? ': ' . $e['message'] : ''); }
  return [$resp, $code, $err];
}

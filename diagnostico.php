<?php
// diagnostico.php — comprueba PHP, cURL/openssl, la clave y la conexión con Google. BÓRRALO cuando termines.
require_once __DIR__ . '/http.php';
header('Content-Type: text/plain; charset=utf-8');
echo "PHP: " . PHP_VERSION . "\n";
echo "cURL: " . (function_exists('curl_init') ? 'activo' : 'no activo (no es obligatorio: se usa openssl)') . "\n";
echo "openssl: " . (extension_loaded('openssl') ? 'activo' : 'NO ACTIVO (activa extension=openssl en php.ini)') . "\n";
echo "Certificados (cafile): " . (http_cafile() !== '' ? http_cafile() : 'no encontrado') . "\n";
echo "php.ini en uso: " . (php_ini_loaded_file() ?: 'ninguno') . "\n";
echo "knowledge.php: " . (is_file(__DIR__ . '/knowledge.php') ? 'ok' : 'NO esta') . "\n";
$key = getenv('GEMINI_API_KEY');
if (!$key && is_file(__DIR__ . '/../gemini_api_key.php')) { $key = @include __DIR__ . '/../gemini_api_key.php'; }
$key = is_string($key) ? trim($key) : '';
echo "Clave de Gemini: " . ($key !== '' ? 'encontrada (empieza por ' . substr($key, 0, 3) . ', ' . strlen($key) . ' caracteres)' : 'NO encontrada (abre setup.php)') . "\n";
if ($key !== '') {
  list($r, $code, $err) = http_request('GET', 'https://generativelanguage.googleapis.com/v1beta/models?pageSize=100', ['x-goog-api-key: ' . $key], null, 15);
  echo "Conexion con Google: " . ($r === false ? "FALLA ($err)" : "HTTP $code") . "\n";
  if ($r !== false && $code === 200) {
    $dd = json_decode($r, true);
    echo "Modelos gemini que tu clave puede usar con generateContent:\n";
    foreach (($dd['models'] ?? []) as $m) {
      $n = str_replace('models/', '', $m['name'] ?? '');
      if (strpos($n, 'gemini-') === 0 && in_array('generateContent', $m['supportedGenerationMethods'] ?? [])) { echo " - $n\n"; }
    }
    echo "Pon en asistente-ia.php (variable \$MODELS) uno o dos de esta lista.\n";
  } elseif ($r !== false) {
    echo substr($r, 0, 300) . "\n";
  }
}

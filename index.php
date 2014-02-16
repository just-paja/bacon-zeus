<?

if (file_exists($f = 'lib/vendor/just-paja/fudjan/index.php')) {
	define('BASE_DIR', __DIR__);
	require_once $f;
}

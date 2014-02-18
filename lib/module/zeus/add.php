<?

$status = 400;
$post = $request->post();
$gps = explode(',', $request->post('gps'));
$post['gps'] = new \System\Gps(array(
	'lat' => $gps[0],
	'lng' => $gps[1],
));

$visitor = create('Zeus\Visitor', $post);

if ($visitor) {
	$status = 200;
}

return $this->json_response($status, null, array(
	'stats' => Zeus\Visitor::get_stats(),
	'markers' => Zeus\Visitor::get_markers()
));

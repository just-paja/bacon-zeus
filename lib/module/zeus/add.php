<?

$status = 400;
$post = $request->post();
$gps = explode(',', $request->post('gps'));
$loc = \System\Json::decode(html_entity_decode($post['loc']));
$post['gps'] = new \System\Gps(array(
	'lat' => $gps[0],
	'lng' => $gps[1],
));

$visitor = create('Zeus\Visitor', $post);

if ($visitor) {
	$status = 200;
}

return $this->json_response($status, null, Zeus\Visitor::get_stats());

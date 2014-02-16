<?

namespace Zeus
{
	class Visitor extends \System\Model\Database
	{
		protected static $attrs = array(
			'name'     => array('varchar'),
			'country'  => array('varchar'),
			'city'     => array('varchar'),
			'gps'      => array('point'),
			'distance' => array('float'),
		);


		public static function get_stats()
		{
			$table = \System\Model\Database::get_table('Zeus\Visitor');
			$users = count_all('Zeus\Visitor');
			$total = \System\Database::query('SELECT SUM(`distance`) as distance FROM '.$table)->fetch();

			if (is_null($total['distance'])) {
				$total = 0;
			} else {
				$total = $total['distance'];
			}

			return array(
				"distance" => $total,
				"users" => $users
			);
		}


		public static function get_markers()
		{
			$markers = get_all('Zeus\Visitor')->add_cols(array('total' => 'COUNT(*)'), false)->group_by('city')->fetch();
			$data = array();

			foreach ($markers as $marker) {
				$data[] = array(
					'country' => $marker->country,
					'city'    => $marker->city,
					'gps'     => $marker->gps,
					'count'   => $marker->total
				);
			}

			return $data;
		}
	}
}

<!DOCTYPE html>
<html>
	<head>
		<?
			$ren->content_for('scripts', 'bower/async/lib/async');
			$ren->content_for('scripts', 'bower/pwf-async-compat/lib/async-compat');
			$ren->content_for('scripts', 'bower/pwf-queue/lib/queue');
			$ren->content_for('scripts', 'bower/pwf-locales/lib/locales');
			$ren->content_for('scripts', 'bower/pwf-comm/lib/comm');
			$ren->content_for('scripts', 'bower/pwf-comm/lib/mods/http');
			$ren->content_for('scripts', 'bower/pwf-comm-form/lib/comm-form');
			$ren->content_for('scripts', 'bower/pwf-form/lib/form');
			$ren->content_for('scripts', 'bower/pwf-form/lib/input');
			$ren->content_for('scripts', 'bower/pwf-form/lib/input/default');
			$ren->content_for('scripts', 'bower/pwf-input-gps/lib/gps');
			$ren->content_for('scripts', 'bower/pwf-input-location/lib/location');
			$ren->content_for('scripts', 'bower/pwf-input-location/lib/location');
			$ren->content_for('scripts', 'scripts/zeus');

			$ren->content_for('styles', 'styles/pwf/form');
			$ren->content_for('styles', 'styles/zeus');

			$ren->content_from('head');
		?>
		<title>Title</title>
	</head>

	<body>
		<div class="zeus"></div>
	</body>
</html>

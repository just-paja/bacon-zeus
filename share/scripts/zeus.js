pwf.register('zeus', function()
{
	var
		cont,
		form,
		input,
		stats = null,
		markers = null,
		local_country = 'Czech republic',
		local_addr = 'Pardubice, Czech republic',
		local_bounds = null,
		local_gps = null;


	this.is_ready = function()
	{
		return pwf.mi(['jquery', 'form', 'input', 'async']);
	};


	this.init = function()
	{
		cont = pwf.jquery('.zeus');

		if (cont.length) {

			cont.menu = pwf.jquery.div('menu');
			cont.inner = pwf.jquery.div('inner');
			cont.loader = pwf.jquery.div('loader');
			cont.stats = pwf.jquery.div('stats');

			cont.append(cont.inner);

			cont.inner
				.append(cont.loader)
				.append(cont.stats)
				.append(cont.menu);

			cont.addClass('loading');
			cont.inner.css('opacity', 0);

			form = pwf.form.create({
				'parent':cont.inner,
				'action':'add',
				'on_before_send':callback_before_send,
				'on_ready':callback_success,
				'on_error':callback_error,
				"elements":[
					{
						'type':'text',
						'name':'name',
						'placeholder':'Jméno',
						'required':true
					},
					{
						'type':'hidden',
						'name':'country'
					},
					{
						'type':'hidden',
						'name':'city'
					},
					{
						'type':'hidden',
						'name':'gps'
					},
					{
						'type':'hidden',
						'name':'distance'
					},
					{
						'type':'text',
						'name':'city_addr',
						'placeholder':'Město',
						'required':true,
						'on_change':function(input, val) {
							var loc = input.get('form').get_input('loc');

							loc.val(null).el.addr.val(val);
							loc.update_by_addr();
						}
					},
					{
						'type':'location',
						'name':'loc',
						'minlength':0,
						'on_map_ready':function(ctrl) {
							return function(input) {
								var check = function(ctrl) {
									return function() {
										if (ctrl.get_markers() !== null && ctrl.get_stats() !== null && ctrl.get_gps()) {
											ctrl.show();
										}
									};
								}(ctrl);

								ctrl.load_pos(check).load_stats(check).load_markers(check);
							};
						}(this),
						'on_change':function(input, val) {
							var f = input.get('form');

							country = f.get_input('country').val(val.country);
							country = f.get_input('city').val(val.city);
							country = f.get_input('gps').val(val.gps.lat + ',' + val.gps.lng);
						}
					}
				]
			});

			pwf.queue.on('zeus-loaded', function(context) {
				context.data.show();
			}, this);
		}

		return true;
	};


	this.get_markers = function()
	{
		return markers;
	};


	this.get_map = function()
	{
		return form.get_input('loc').el.gps.map;
	};


	this.get_gps = function()
	{
		return local_gps;
	};


	this.get_stats = function()
	{
		return stats;
	};


	this.update_markers = function(arg_markers)
	{
		if (typeof arg_markers != 'undefined') {
			markers = arg_markers;
		}

		for (var i = 0; i < markers.length; i++) {
			var mark = markers[i];

			if (typeof mark.instance != 'undefined') {
				mark.instance.setMap(null);
			}

			mark.instance = new google.maps.Marker({
				'position':mark.gps,
				'animation':google.maps.Animation.DROP,
				'icon':'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=H|000000|ffffff',
				'map':this.get_map(),
				'title':mark.city
			});
		}

		return this;
	};


	this.update_stats = function(arg_stats)
	{
		var users, total, average;

		if (typeof arg_stats != 'undefined') {
			stats = arg_stats;
		}

		cont.stats.html('');

		users = pwf.jquery.div('total-users')
			.append(pwf.jquery.span('label').html('Počet lidí:'))
			.append(pwf.jquery.span('val').html(stats.users));

		total = pwf.jquery.div('total-distance')
			.append(pwf.jquery.span('label').html('Celková ujetá vzdálenost:'))
			.append(pwf.jquery.span('val').html(this.humanize_si(stats.distance, 'm')));

		average = pwf.jquery.div('average-distance')
			.append(pwf.jquery.span('label').html('Průměrná ujetá vzdálenost:'))
			.append(pwf.jquery.span('val').html(this.humanize_si(stats.users > 0 ? stats.distance/stats.users:0, 'm')));

		cont.stats
			.append(users)
			.append(total)
			.append(average);

		return this;
	};


	this.get_form = function()
	{
		return form;
	};


	this.humanize_si = function(val, unit)
	{
		var
			level = 0,
			unit_prefix = '';

		while (val >= 1000) {
			val = val/1000;
			level ++;
		}

		if (level == 1) {
			unit_prefix = 'k';
		}

		if (level == 2) {
			unit_prefix = 'M';
		}

		return Math.round((val*10)/10) + '&nbsp;' + unit_prefix + unit;
	};


	this.show = function()
	{
		cont.bind('keyup', this, callback_keyup);

		cont.removeClass('loading');
		cont.inner.css('opacity', 1);

		google.maps.event.trigger(this.get_map(), 'resize');

		return this
			.show_home_marker()
			.reset_view();
	};


	this.show_home_marker = function()
	{
		var marker = new google.maps.Marker({
			'position':local_gps,
			'animation':google.maps.Animation.DROP,
			'icon':'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=H|000000|ffffff'
		});

		marker.setMap(this.get_map());
		return this;
	};


	this.reset_view = function(next)
	{
		var coder = new google.maps.Geocoder();

		coder.geocode({"address":local_country}, function(ctrl, next) {
			return function(res, stat) {
				if (stat === 'OK' && typeof res[0] !== 'undefined') {
					ctrl.get_map().fitBounds(res[0].geometry.bounds);

					if (typeof next == 'function') {
						next();
					}
				}
			};
		}(this, next));

		return this;
	};


	this.load_pos = function(next)
	{
		var coder = new google.maps.Geocoder();

		coder.geocode({"address":local_addr}, function(ctrl, next) {
			return function(res, stat) {
				if (stat === 'OK' && typeof res[0] !== 'undefined') {
					ctrl.use_gps(res[0]);

					if (typeof next == 'function') {
						next();
					}
				}
			};
		}(this, next));

		return this;
	};


	this.use_gps = function(res)
	{
		local_bounds = res.geometry.bounds;
		local_gps = res.geometry.location;
	};


	this.load_stats = function(next)
	{
		pwf.comm.get('stats', null, function(ctrl)
		{
			return function(err, response) {
				ctrl.update_stats(response.data);

				if (typeof next == 'function') {
					next();
				}
			};
		}(this));

		return this;
	};


	this.load_markers = function(next)
	{
		pwf.comm.get('markers', null, function(ctrl)
		{
			return function(err, response) {
				ctrl.update_markers(response.data);

				if (typeof next == 'function') {
					next();
				}
			};
		}(this));

		return this;
	};


	this.submit = function(next)
	{
		var loc = form.get_input('loc').val();

		this.query_distance(loc, function(ctrl, next) {
			return function(error, loc, distance) {
				var dist = distance.rows[0].elements[0].distance.value;

				ctrl.get_form().get_input('distance').val(dist);
				ctrl.get_form().send();
			};
		}(this, next));

		return this;
	};


	this.show_location = function(loc, distance)
	{
		var
			data = form.get_data(),
			el = pwf.jquery('.location');

		if (!el.length) {
			el = pwf.jquery.div('location');
			cont.append(el);
		}

		el.html('');
		el.name = pwf.jquery.div('name').html(data.name);
		el.city = pwf.jquery.div('city').html(loc.city);
		el.dist = pwf.jquery.div('dist').html(distance.rows[0].elements[0].distance.text);

		el
			.append(el.name)
			.append(el.city)
			.append(el.dist);

		return this;
	};


	this.query_distance = function(loc, next)
	{
		var
			service = new google.maps.DistanceMatrixService(),
			opts = {
				'origins':[loc.city + ', ' + loc.country],
				'destinations':[local_gps],
				'travelMode':google.maps.TravelMode.DRIVING,
				'unitSystem':google.maps.UnitSystem.METRIC,
				'avoidHighways':false,
				'avoidTolls':false
			};

		service.getDistanceMatrix(opts, function(ctrl, loc, next) {
			return function(response, status) {
				var error = null;

				if (status != google.maps.DistanceMatrixStatus.OK) {
					error = 'Not found';
				}

				if (typeof next == 'function') {
					next(error, loc, response);
				}
			};
		}(this, loc, next));
	};


	var callback_success = function(context)
	{
		v('form send and ready');
	};


	var callback_before_send = function()
	{
	};


	var callback_error = function(response, err)
	{
		v(err);
	};


	var callback_keyup = function(e)
	{
		if (e.which == 13) {
			pwf.callbacks.cancel(e).data.submit();
		}
	};
});

window.addEventListener("load", function(event) {

	var contestStatus = document.getElementById("contestStatus");
	var contestantDisplay = document.getElementById("contestantDisplay");
	var start = $('button[name="start"]');
	var stop = $('button[name="stop"]');
	var close = document.getElementById("close");

	var socket = io('https://' + location.host + '/');

	var right = [];
	var i_right = 0;

	stop.prop("disabled",true);
	close.disabled = true;

	socket.on('connect', function (data) {
		contestStatus.src = "img/bullet_green.png";
		close.disabled = false;
	});

	$('button[name="start"]').click(function(){
		var nr = $(this).attr("value");
		var stopthis= $('button[name="stop"][value="'+nr+'"]');
		stopthis.prop("disabled",false);
		start.prop("disabled",true);
		right[i_right] = nr;
		i_right++;

	});

	$('button[name="stop"]').click(function(){
		var nr = $(this).attr("value");
		var contestantStatus = document.getElementById("img"+nr);
		contestantStatus.src = "img/right.png";
		start.prop("disabled",false);
		stop.prop("disabled",true);
		$.each(right, function(index, value) {
			$('button[name="start"][value="'+value+'"]').prop("disabled",true);
		});
	});

});

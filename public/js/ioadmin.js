window.addEventListener("load", function(event) {

	var ref;

	var contest = $( "input[name='nameofcontest']" ).val();

	var contestStatus = document.getElementById("contestStatus");
	var contestantDisplay = document.getElementById("contestantDisplay");
	var start = $('button[name="start"]');
	var stop = $('button[name="stop"]');
	var close = document.getElementById("close");

//	var typ = document.getElementById("typ");
//	var glowa = document.getElementById("glowa");
//	var kloda = document.getElementById("kloda");
//	var nogi = document.getElementById("nogi");
//	var ruch = document.getElementById("ruch");

	var socket = io('https://' + location.host + '/');

	var right = [];
	var i_right = 0;

	stop.prop("disabled",true);
	close.disabled = true;

	socket.on('connect', function (data) {
		contestStatus.src = "img/bullet_green.png";
		close.disabled = false;
		socket.emit('contest', contest);
	});

	$('button[name="start"]').click(function(){
		var btnval = $(this).attr("value");
		var str = btnval.split("-");
		var group = str[0];
		var nr = str[1];
		var stopthis= $('button[name="stop"][value="'+group+'-'+nr+'"]');
		stopthis.prop("disabled",false);
		start.prop("disabled",true);
		right[i_right] = nr;
		i_right++;
		socket.emit('contestant', nr);
		socket.emit('group', group);
		

		var refstr = "";
		$( "input[name='"+group+"']" ).each(function() {
			refstr += this.value;
			refstr += '-';
		});
		socket.emit('refs', refstr);
	});

	$('button[name="stop"]').click(function(){
		var btnval = $(this).attr("value");
		var str = btnval.split("-");
		var group = str[0];
		var nr = str[1];
		var contestantStatus = document.getElementById("img"+nr);
		contestantStatus.src = "img/right.png";
		start.prop("disabled",false);
		stop.prop("disabled",true);
	});

	socket.on('score', function (data) {
		var str = data.split("-");
		if(str[2] != "") $('#'+str[0]+'-'+str[1]+' > .ref').text(str[1]);
		else $('#'+str[0]+'-'+str[1]+' > .ref').text("");
		$('#'+str[0]+'-'+str[1]+' > .typ').text(str[2]);
		$('#'+str[0]+'-'+str[1]+' > .glowa').text(str[3]);
		$('#'+str[0]+'-'+str[1]+' > .kloda').text(str[4]);
		$('#'+str[0]+'-'+str[1]+' > .nogi').text(str[5]);
		$('#'+str[0]+'-'+str[1]+' > .ruch').text(str[6]);
	});

});

window.addEventListener("load", function(event) {

	var glob_nr = "brak";
	var glob_group = "brak";
	var glob_refstr = "";

	var glob_refarr = [];
	var i_glob = 0;

	var ObjRef = function(pusername, pscore) {
	this.username = pusername;
	this.score = pscore;
	}

	var ref;

	var contest = $( "input[name='nameofcontest']" ).val();

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
		socket.emit('contest', contest);
	});

	$('button[name="start"]').click(function(){

		glob_nr = 0;
		glob_group = "";
		glob_refstr = "";
		glob_refarr = [];
		i_glob = 0;

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
		glob_nr = nr;
		glob_group = group;

		var refstr = "";
		$( "input[name='"+group+"']" ).each(function() {
			refstr += this.value;
			refstr += '-';
			var newObjRef = new ObjRef(this.value, "");
			glob_refarr[i_glob] = newObjRef;
			i_glob++;
		});
		socket.emit('refs', refstr);
		glob_refstr = refstr;
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
		socket.emit('stop', "Proszę wystawić ocenę!");
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
		$.each(glob_refarr, function(index, value) {
			if(str[1] == value.username) {
			var newObjRef = new ObjRef(value.username, data);
			glob_refarr[index] = newObjRef;
			}
		});
	});

	socket.on('ref_start', function (data) {
		socket.emit('contestant', glob_nr);
		socket.emit('group', glob_group);
		socket.emit('refs', glob_refstr);
		socket.emit('score_backup', glob_refarr)
	});

});

window.addEventListener("load", function(event) {

	var temp;
	var contest = document.getElementById("contestname").textContent;
	var group;
	var no;

	var contestStatus = document.getElementById("contestStatus");
	var groupname = document.getElementById("groupname");
	var contestantno = document.getElementById("contestantno");
	var myname = document.getElementById("myname");
	var me = myname.value;
	var err = document.getElementById("err");
	
	var typ = document.getElementById("typ");
	var glowa = document.getElementById("glowa");
	var kloda = document.getElementById("kloda");
	var nogi = document.getElementById("nogi");
	var ruch = document.getElementById("ruch");
	var judge = document.getElementById("judge");

	var socket = io('https://' + location.host + '/');

	judge.disabled = true;

	socket.on('connect', function (data) {
		contestStatus.src = "img/bullet_green.png";
		socket.emit('ref_start');
	});

	$( "#styp" ).text($( "#typ" ).val());
	$( "#sglowa" ).text($( "#glowa" ).val());
	$( "#skloda" ).text($( "#kloda" ).val());
	$( "#snogi" ).text($( "#nogi" ).val());
	$( "#sruch" ).text($( "#ruch" ).val());

	$( "#typ" ).change(function() {
		temp = $(this).val();
		$( "#styp" ).text(temp);
	});

	$( "#glowa" ).change(function() {
		temp = $(this).val();
		$( "#sglowa" ).text(temp);
	});

	$( "#kloda" ).change(function() {
		temp = $(this).val();
		$( "#skloda" ).text(temp);
	});

	$( "#nogi" ).change(function() {
		temp = $(this).val();
		$( "#snogi" ).text(temp);
	});

	$( "#ruch" ).change(function() {
		temp = $(this).val();
		$( "#sruch" ).text(temp);
	});

	socket.on('group', function (data) {
		groupname.textContent = data;
		group = data;
	});

	socket.on('contestant', function (data) {
		contestantno.textContent = data;
		no = data;
	});

	socket.on('refs', function (data) {
		var refstr = data.split("-");
		refstr.pop();
		$.each(refstr, function(index, value) {
			if ( me == value ) {
				judge.disabled = false;
				err.textContent = "";
				return false;
			} else {
				judge.disabled = true;
				err.textContent = "Nie możesz oceniać, ponieważ nie ma cię na liście sędziów!";
			}
		});
	});

	typ.addEventListener("change", function(event) {
		socket.emit('score', group+'-'+me+'-'+typ.value+'-'+glowa.value+'-'+kloda.value+'-'+nogi.value+'-'+ruch.value);
	});

	glowa.addEventListener("change", function(event) {
		socket.emit('score', group+'-'+me+'-'+typ.value+'-'+glowa.value+'-'+kloda.value+'-'+nogi.value+'-'+ruch.value);
	});

	kloda.addEventListener("change", function(event) {
		socket.emit('score', group+'-'+me+'-'+typ.value+'-'+glowa.value+'-'+kloda.value+'-'+nogi.value+'-'+ruch.value);
	});

	nogi.addEventListener("change", function(event) {
		socket.emit('score', group+'-'+me+'-'+typ.value+'-'+glowa.value+'-'+kloda.value+'-'+nogi.value+'-'+ruch.value);
	});

	ruch.addEventListener("change", function(event) {
		socket.emit('score', group+'-'+me+'-'+typ.value+'-'+glowa.value+'-'+kloda.value+'-'+nogi.value+'-'+ruch.value);
	});

	judge.addEventListener("click", function(event) {
		socket.emit('score', group+'-'+me+'-'+""+'-'+""+'-'+""+'-'+""+'-'+"");
		socket.emit('db', contest+'-'+group+'-'+no+'-'+me+'-'+typ.value+'-'+glowa.value+'-'+kloda.value+'-'+nogi.value+'-'+ruch.value);
		judge.disabled = true;
	});

	socket.on('score_backup', function (data) {
		$.each(data, function(index, value) {
			if(me == value.username) {
				var str = value.score.split("-");
				$( "#styp" ).text(str[2]);
				$( "#sglowa" ).text(str[3]);
				$( "#skloda" ).text(str[4]);
				$( "#snogi" ).text(str[5]);
				$( "#sruch" ).text(str[6]);
				$( "#typ" ).val(str[2]);
				$( "#glowa" ).val(str[3]);
				$( "#kloda" ).val(str[4]);
				$( "#nogi" ).val(str[5]);
				$( "#ruch" ).val(str[6]);
			}
		});
	});

	socket.on('stop', function (data) {
		if(judge.disabled === false) err.textContent = data;
	});

});

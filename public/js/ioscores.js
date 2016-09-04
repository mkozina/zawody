window.addEventListener("load", function(event) {

	var newHTML = [];

	var contestStatus = document.getElementById("contestStatus");

	var socket = io('https://' + location.host + '/');

	socket.on('connect', function (data) {
		contestStatus.src = "img/bullet_green.png";
	});

	socket.on('db', function (data) {
		var str = data.split("-");

		newHTML.push('<tr>');
    newHTML.push('<td>' + str[2] + '</td>');
    newHTML.push('<td>' + str[3] + '</td>');
    newHTML.push('<td>' + str[4] + '</td>');
    newHTML.push('<td>' + str[5] + '</td>');
    newHTML.push('<td>' + str[6] + '</td>');
    newHTML.push('<td>' + str[7] + '</td>');
    newHTML.push('<td>' + str[8] + '</td>');
		newHTML.push('</tr>');

		$( '#partial-'+str[1]+' > tr:last' ).after(newHTML.join(""));
		newHTML = [];
	});

	socket.on('calc', function (data) {
		var str = data.split("-");

		newHTML.push('<tr>');
    newHTML.push('<td>' + str[2] + '</td>');
    newHTML.push('<td>' + str[3] + '</td>');
    newHTML.push('<td>' + str[4] + '</td>');
    newHTML.push('<td id="' + str[2] + '"></td>');
		newHTML.push('</tr>');

		$( '#final-'+str[1]+' > tr:last' ).after(newHTML.join(""));
		newHTML = [];
	});

	socket.on('ranking', function (data) {
		$.each(data, function(index, value) {
			newHTML.push(value.rank);
			if(value.rank == 1) newHTML.push('<img class="center-block" src="/img/trophy-gold-animated-gif-4.gif" height="20" width="23" alt="gold" />');
			else if(value.rank == 2) newHTML.push('<img class="center-block" src="/img/trophy-silver-animated-gif-3.gif" height="20" width="23" alt="silver" />');
			else if(value.rank == 3) newHTML.push('<img class="center-block" src="/img/trophy-bronze-animated-gif-3.gif" height="20" width="23" alt="bronze" />');
			$( '#final-'+value.group+' > tr > #'+value.no ).append(newHTML.join(""));
			newHTML = [];
		});
	});

});

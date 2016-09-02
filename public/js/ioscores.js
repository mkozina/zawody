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

		$( '#'+str[1]+' > tr:last' ).after(newHTML.join(""));
		newHTML = [];
	});

});
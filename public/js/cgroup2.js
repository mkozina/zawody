var arrf = [];
var arrm = [];

$( ".form" ).submit(function( event ) {

	event.preventDefault();

	var fnameofcontest = $( this ).find( "select[name='nameofcontest']" ).val();
	var fnamef = $( this ).find( "input[name='namef']" ).val();
	var fnamem = $( this ).find( "input[name='namem']" ).val();

	$.post( 'https://localhost:3000/cgroup', {
		arrf: arrf,
		arrm: arrm,
		namef: fnamef,
		namem: fnamem,
		nameofcontest: fnameofcontest
	}, function(data, textStatus, jqXHR) {
		window.location.href = data.redirect;
	});

});

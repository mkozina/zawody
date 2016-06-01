var arr = [];
var i = 0;
var no = 1;
var stop = 0;
var copy = 0;

var Obj = function(pno, pname) {
	this.no = pno;
	this.name = pname;
};

var newHTML = [];

$( "#add" ).click(function() {

	stop = 0;

	$( "select option:selected" ).each(function() {
		if( $( this ).val() == "ten" || $( this ).val() == "twenty") ;
		else {
			var temp = $( this ).text();
			$.each(arr, function(index, value) {
				if ( temp == value.name ) {
					alert( "Każdego zawodnika można dodać tylko raz!" );
					stop = 1;
					return;
				}
			});
			if (stop == 1) return;
			var newObj = new Obj(no, $( this ).text());
			arr[i] = newObj;
			i++;
			no++;
		}
	});

	$.each(arr, function(index, value) {
		newHTML.push('<ul>');
    	newHTML.push(
		'<li>' +
		value.no + '. ' + value.name +
		'<button class="del" type="button" value="' + value.no + '">Remove</button>' +
		'</li>');
		newHTML.push('</ul>');
	});
	$("#startinglist").html(newHTML.join(""));
	newHTML = [];

});

$( "#startinglist" ).on("click", "button.del", function() {

	copy = 0;
	var j;
	var temp = $(this).attr("value");
	for(j = 0; j < arr.length; ++j){
		if ( temp == arr[j].no ) {
			if (j+1 < arr.length) arr[j] = arr[j+1];
			copy = 1;
		}
		if (copy == 1) {
			if (j+1 < arr.length) arr[j] = arr[j+1];
			else {
				arr.pop();
				i--;
			}
		}
	}

	$.each(arr, function(index, value) {
		newHTML.push('<ul>');
    	newHTML.push(
		'<li>' +
		value.no + '. ' + value.name +
		'<button class="del" type="button" value="' + value.no + '">Remove</button>' +
		'</li>');
		newHTML.push('</ul>');
	});
	$("#startinglist").html(newHTML.join(""));
	newHTML = [];

});

$( ".form" ).submit(function( event ) {

	event.preventDefault();

	var fname = $( this ).find( "input[name='name']" ).val();
	var fscores = $( this ).find( "select[name='scores']" ).val();
	var fgranulation = $( this ).find( "input[type='radio'][name='granulation']:checked" ).val();
	var fnoref = $( this ).find( "input[name='noref']" ).val();
	var fdateofcontest = $( this ).find( "input[name='dateofcontest']" ).val();

	$.post( 'https://localhost:3000/ccontest', {
		arr: arr,
		name: fname,
		scores: fscores,
		granulation: fgranulation,
		noref: fnoref,
		dateofcontest: fdateofcontest
	}, function(data, textStatus, jqXHR) {
		window.location.href = data.redirect;
	});
	
});

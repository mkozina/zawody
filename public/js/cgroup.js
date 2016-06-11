//dodac arrfref i arrmref + poprawić cgroupPost w index.js

var nofref = 1;
var nomref = 1;
var arrfref = [];
var arrmref = [];
var arrf = [];
var arrm = [];
var i_fref = 0;
var i_mref = 0;
var i_f = 0;
var i_m = 0;
var stopfref = 0;
var copyfref = 0;
var stopmref = 0;
var copymref = 0;
var stopf = 0;
var copyf = 0;
var stopm = 0;
var copym = 0;

var Obj = function(pno, pname) {
	this.no = pno;
	this.name = pname;
};

var ObjRef = function(pno, pusername) {
	this.no = pno;
	this.username = pusername;
}

var newHTML = [];

var noref = $( ".form" ).find( "input[name='noref']" ).val();

$( "#addfemaleref" ).click(function() {

	stopfref = 0;

	if ( i_fref >= noref ) {
		alert( "Liczba sedziów w grupach nie może przekraczać " + noref + "!" );
		return;
	}

	$( "#addfemalelistref option:selected" ).each(function() {

		var temp = $( this ).val();
		$.each(arrfref, function(index, value) {
			if ( temp == value.username ) {
				alert( "Każdego sędziego można dodać tylko raz!" );
				stopfref = 1;
				return;
			}
		});
		if (stopfref == 1) return;
		var newObjRef = new ObjRef(nofref, $( this ).text());
		arrfref[i_fref] = newObjRef;
		i_fref++;
		nofref++;

	});

	$.each(arrfref, function(index, value) {
		newHTML.push('<ul>');
    	newHTML.push(
		'<li>' +
		value.no + '. ' + value.username +
		'<button class="del" type="button" value="' + value.no + '">Remove</button>' +
		'</li>');
		newHTML.push('</ul>');
	});
	$("#groupfemaleref").html(newHTML.join(""));
	newHTML = [];

});

$( "#groupfemaleref" ).on("click", "button.del", function() {

	copyfref = 0;
	var j;
	var temp = $(this).attr("value");
	for(j = 0; j < arrfref.length; ++j){
		if ( temp == arrfref[j].no ) {
			if (j+1 < arrfref.length) arrfref[j] = arrfref[j+1];
			copyfref = 1;
		}
		if (copyfref == 1) {
			if (j+1 < arrfref.length) arrfref[j] = arrfref[j+1];
			else {
				arrfref.pop();
				i_fref--;
			}
		}
	}

	$.each(arrfref, function(index, value) {
		newHTML.push('<ul>');
    	newHTML.push(
		'<li>' +
		value.no + '. ' + value.username +
		'<button class="del" type="button" value="' + value.no + '">Remove</button>' +
		'</li>');
		newHTML.push('</ul>');
	});
	$("#groupfemaleref").html(newHTML.join(""));
	newHTML = [];

});

$( "#addmaleref" ).click(function() {

	stopmref = 0;

	if ( i_mref >= noref ) {
		alert( "Liczba sedziów w grupach nie może przekraczać " + noref + "!" );
		return;
	}

	$( "#addmalelistref option:selected" ).each(function() {

		var temp = $( this ).text();
		$.each(arrmref, function(index, value) {
			if ( temp == value.username ) {
				alert( "Każdego sędziego można dodać tylko raz!" );
				stopmref = 1;
				return;
			}
		});
		if (stopmref == 1) return;
		var newObjRef = new ObjRef(nomref, $( this ).text());
		arrmref[i_mref] = newObjRef;
		i_mref++;
		nomref++;

	});

	$.each(arrmref, function(index, value) {
		newHTML.push('<ul>');
    	newHTML.push(
		'<li>' +
		value.no + '. ' + value.username +
		'<button class="del" type="button" value="' + value.no + '">Remove</button>' +
		'</li>');
		newHTML.push('</ul>');
	});
	$("#groupmaleref").html(newHTML.join(""));
	newHTML = [];

});

$( "#groupmaleref" ).on("click", "button.del", function() {

	copymref = 0;
	var j;
	var temp = $(this).attr("value");
	for(j = 0; j < arrmref.length; ++j){
		if ( temp == arrmref[j].no ) {
			if (j+1 < arrmref.length) arrmref[j] = arrmref[j+1];
			copymref = 1;
		}
		if (copymref == 1) {
			if (j+1 < arrmref.length) arrmref[j] = arrmref[j+1];
			else {
				arrmref.pop();
				i_mref--;
			}
		}
	}

	$.each(arrmref, function(index, value) {
		newHTML.push('<ul>');
    	newHTML.push(
		'<li>' +
		value.no + '. ' + value.username +
		'<button class="del" type="button" value="' + value.no + '">Remove</button>' +
		'</li>');
		newHTML.push('</ul>');
	});
	$("#groupmaleref").html(newHTML.join(""));
	newHTML = [];

});

$( "#addfemale" ).click(function() {

	stopf = 0;

	$( "#addfemalelist option:selected" ).each(function() {

			var str = $( this ).val().split("-");
			$.each(arrf, function(index, value) {
				if ( str[1] == value.name ) {
					alert( "Każdego zawodnika można dodać tylko raz!" );
					stopf = 1;
					return;
				}
			});
			if (stopf == 1) return;
			var newObj = new Obj(str[0], str[1]);
			arrf[i_f] = newObj;
			i_f++;
		
	});

	$.each(arrf, function(index, value) {
		newHTML.push('<ul>');
    	newHTML.push(
		'<li>' +
		value.no + '. ' + value.name +
		'<button class="del" type="button" value="' + value.no + '">Remove</button>' +
		'</li>');
		newHTML.push('</ul>');
	});
	$("#groupfemale").html(newHTML.join(""));
	newHTML = [];

});

$( "#groupfemale" ).on("click", "button.del", function() {

	copyf = 0;
	var j;
	var temp = $(this).attr("value");
	for(j = 0; j < arrf.length; ++j){
		if ( temp == arrf[j].no ) {
			if (j+1 < arrf.length) arrf[j] = arrf[j+1];
			copyf = 1;
		}
		if (copyf == 1) {
			if (j+1 < arrf.length) arrf[j] = arrf[j+1];
			else {
				arrf.pop();
				i_f--;
			}
		}
	}

	$.each(arrf, function(index, value) {
		newHTML.push('<ul>');
    	newHTML.push(
		'<li>' +
		value.no + '. ' + value.name +
		'<button class="del" type="button" value="' + value.no + '">Remove</button>' +
		'</li>');
		newHTML.push('</ul>');
	});
	$("#groupfemale").html(newHTML.join(""));
	newHTML = [];

});

$( "#addmale" ).click(function() {

	stopm = 0;

	$( "#addmalelist option:selected" ).each(function() {

			var str = $( this ).val().split("-");
			$.each(arrm, function(index, value) {
				if ( str[1] == value.name ) {
					alert( "Każdego zawodnika można dodać tylko raz!" );
					stopm = 1;
					return;
				}
			});
			if (stopm == 1) return;
			var newObj = new Obj(str[0], str[1]);
			arrm[i_m] = newObj;
			i_m++;
		
	});

	$.each(arrm, function(index, value) {
		newHTML.push('<ul>');
    	newHTML.push(
		'<li>' +
		value.no + '. ' + value.name +
		'<button class="del" type="button" value="' + value.no + '">Remove</button>' +
		'</li>');
		newHTML.push('</ul>');
	});
	$("#groupmale").html(newHTML.join(""));
	newHTML = [];

});

$( "#groupmale" ).on("click", "button.del", function() {

	copym = 0;
	var j;
	var temp = $(this).attr("value");
	for(j = 0; j < arrm.length; ++j){
		if ( temp == arrm[j].no ) {
			if (j+1 < arrm.length) arrm[j] = arrm[j+1];
			copym = 1;
		}
		if (copym == 1) {
			if (j+1 < arrm.length) arrm[j] = arrm[j+1];
			else {
				arrm.pop();
				i_m--;
			}
		}
	}

	$.each(arrm, function(index, value) {
		newHTML.push('<ul>');
    	newHTML.push(
		'<li>' +
		value.no + '. ' + value.name +
		'<button class="del" type="button" value="' + value.no + '">Remove</button>' +
		'</li>');
		newHTML.push('</ul>');
	});
	$("#groupmale").html(newHTML.join(""));
	newHTML = [];

});

$( ".form" ).submit(function( event ) {

	event.preventDefault();

	var fnameofcontest = $( this ).find( "input[name='nameofcontest']" ).val();
	var fnamef = $( this ).find( "input[name='namef']" ).val();
	var fnamem = $( this ).find( "input[name='namem']" ).val();

	if( i_mref < noref || i_fref < noref) {
		newHTML.push('Liczba sędziów musi być równa ' + noref + '!');
		$(".errorref").html(newHTML.join(""));
		newHTML = [];
		return;
	}

	var address = window.location.href.slice(8).split(":");
	var addressPost = 'https://' + address[0] + ':3000/cgroup';

	$.post( addressPost, {
		arrfref: arrfref,
		arrmref: arrmref,
		arrf: arrf,
		arrm: arrm,
		namef: fnamef,
		namem: fnamem,
		nameofcontest: fnameofcontest
	}, function(data, textStatus, jqXHR) {
		window.location.href = data.redirect;
	});

});

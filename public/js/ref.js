$(function(ready){

	var temp;

	$( "#contest option:selected" ).each(function() {
		temp = $(this).val();
		$( "#contestname" ).val(temp);
	});

	$( "#contest" ).change(function() {
		temp = $(this).val();
		$( "#contestname" ).val(temp);
	});

});

$(function() {

	var source   = $("#input-template").html();
	var template = Handlebars.compile(source);
	var html = template();

	$('#inputContainer').append(html);

	$('#inputRow').on('submit', function() {


			console.log( "call was made");
			return false;

	});

	
	// $.get('/shownames', function(data) {
	// 	console.log(data);
	// 	console.log("Got to line 20");
	// 	$('#addListHere').append(data);
	// });
	
	$(document).on('keyup', ".eachItem", function (e) {
                if (e.keyCode === 13) {
                        var itemInput = $(this).val();
                        var html = template();
                        $('#inputContainer').append(html);
                        $('#inputContainer .inputRow:last-child .eachItem').focus();
                        console.log('test', itemInput);
                }

        });
});


	
	

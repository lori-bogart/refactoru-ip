$(function() {

	var source   = $("#input-template").html();
	var template = Handlebars.compile(source);
	var html = template();

	$('#inputContainer').append(html);

	$('#inputRow').on('submit', function() {

			// console.log( "call was made");
			return false;

	});

	$('#newListForm').submit(function (e) {
		e.preventDefault() 
		$.post("/add", $(this).serialize(), function(data) {
			$("#result").append(data.name); 
			$("#newListForm")[0].reset();
			// console.log(data);
		});
	});
	
	$(document).on('keyup', ".eachItem", function (e) {
                if (e.keyCode === 13) {
                        var itemInput = $(this).val();
                        var html = template();
                        $('#inputContainer').append(html);
                        $('#inputContainer .inputRow:last-child .eachItem').focus();
                        // console.log('test', itemInput);
                }

    });

});

// $("#signup-form").submit(function(e){
// 		//make a post request to our /signup endpoint
// 		$.post('/signup', $(this).serialize(), function(data){
// 			// if the request returned a success message, display it.
// 			if(data.success){
// 				$('#message').text(data.success)
// 			}
// 		})
// 	});
	
	

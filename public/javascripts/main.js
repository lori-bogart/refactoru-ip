$(function() {

	var source   = $("#input-template").html();
	var template = Handlebars.compile(source);
	var html = template();

	$('#packingListItemContainer').append(html);

	$('#inputRow').on('submit', function() {

			// console.log( "call was made");
			return false;

	});

	$('#newListForm').submit(function (e) {
		e.preventDefault() 
		// console.log('test');
		$.post("/add", $(this).serialize(), function(data) {
			$("#result").append('<a href="PackingList?name=' + encodeURIComponent(data.name) + '">' + data.name + '</a>'); 
			$("#newListForm")[0].reset();
			
		});
	});
	
	$(document).on('keydown', ".eachItem", function (e) {
                if (e.keyCode === 13) {
                	e.preventDefault()
                        var itemInput = $(this).val();
                        var html = template();
                        $('#packingListItemContainer').append(html);
                        $('#packingListItemContainer .inputRow:last-child .eachItem').focus();
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
	
	

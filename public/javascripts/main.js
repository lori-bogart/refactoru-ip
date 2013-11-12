$(function() {
	//- handlebars
	//- call handlebar compile and render the page
	var source   = $("#input-template").html();
	var template = Handlebars.compile(source);
	var html = template();

	$('#packingListItemContainer').append(html);

	$('#inputRow').on('submit', function() {
			return false;
	});

	//Pressing Save this list button sends the list to the db for storage; including all the items in the list
	$('#newListForm').submit(function (e) {
		e.preventDefault() 

		$.post("/add", $(this).serialize(), function(data) {
			$("#result").append('<a href="PackingList?name=' + encodeURIComponent(data.name) + '">' + data.name + '</a>'); 
			$("#newListForm")[0].reset();
			var list = $('.inputRow');
			for (i=1 ; i < list.length; i++) { 
				list[i].remove();
			}	
		});
	});

	//adds a new input field each time the user hits enter
	$(document).on('keydown', ".eachItem", function (e) {
                if (e.keyCode === 13) {
                	e.preventDefault()
                        var itemInput = $(this).val();
                        var html = template();
                        $('#packingListItemContainer').append(html);
                        $('#packingListItemContainer .inputRow:last-child .eachItem').focus();
                }

    });

	//- each time the checbox is clicked, a checkmark toggles, and that is sent immediately
	//- to mongo with ajax post
	$('.eachCheckbox').on('change', function (e) {
		//:checked will return true or false
		var data = {checked: $(this).is(':checked'), id: $(this).attr('data-id')}
		$.post("/updateCheckbox", data, function(data) {
			
		});
	});

});

	
	

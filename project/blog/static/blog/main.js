'use strict';
//Code taken from Billy's demo on Friday  
//with attempts to reformat for Hackernews


var clickCommentTree = function clickCommentTree(event){
	event.preventDefault();
	//console.log(this)
	var $this = $(this);
	var template = $("#comment-reply-template").html();
	var $commentForm = $this.siblings(".comment-form-container");
	$commentForm.html(template);
	var form = $commentForm.find("form");
	var action = $this.attr("href");
	form.attr("action", action);
	//console.log($this.attr("href"))
	//console.log(commentForm);
};

var commentFormSubmission = function commentFormSubmission(event){
		event.preventDefault();
		var $this = $(this);
		var $form = $this.find("form");
		console.log($form.serialize())

		$.ajax({
			url: $form.attr("action"),
			method: 'POST',
			data: $form.serialize(),
			success: function(data){
				console.log('server data:\n', data);
				$form[0].reset();
				// $say_res.prepend('<br>'+data['said']+' | ' +data['say']);

				$say_res.html(data);
			}
		});	
};

$(document).ready(function(){
// 	var $form = $('#reply-form');
// 	var $say_res = $('#reply');

// 	$form.on('submit', function(event){
// 		event.preventDefault();
// 		var form = this;

// 		$.ajax({
// 			url: '/blog/',
// 			method: 'POST',
// 			data: $(this).serialize(),
// 			success: function(data){
// 				console.log('server data:\n', data);
// 				form.reset();
// 				// $say_res.prepend('<br>'+data['said']+' | ' +data['say']);

// 				$say_res.html(data);
// 			}
// 		});
// 	});
	var $commentTree = $('.comment-tree');



	$commentTree.on("click", "a.comment-reply-anchor", clickCommentTree);

	var $formContainer = $('.comment-form-container');
	$formContainer.on("submit", commentFormSubmission);

});


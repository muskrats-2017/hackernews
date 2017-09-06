'use strict';
//Code taken from Billy's demo on Friday  
//with attempts to reformat for Hackernews


var clickReplyCommentTree = function clickReplyCommentTree(event){
	event.preventDefault();
	var $this = $(this);
	var template = $("#comment-reply-template").html();
	var $commentFormContainer = $this.parent().siblings(".comment-form-container");
	$commentFormContainer.html(template);
	var form = $commentFormContainer.find("form");
	var action = $this.attr("href");
	form.attr("action", action);
};


var createCommentFormSubmission = function createCommentFormSubmission(event){
	
	event.preventDefault();
	var $form = $(this);
	var $formContainer = $form.parents("div.comment-form-container");
	//console.log($form.serialize())
	var $commentList = $formContainer.siblings("ul");
	//console.log($this.siblings("ul"))
	
	$.ajax({
		url: $form.attr("action"),
		method: 'POST',
		data: $form.serialize(),
		success: function(data){
			
			$formContainer.empty();
			// $say_res.prepend('<br>'+data['said']+' | ' +data['say']);

			$commentList.append("<li>" + data + "</li>");

		},
		error: function(jqXHR, textStatus, errorThrown){
			console.log(arguments);
			$form.find("div.error-display").html(jqXHR.responseText);
		}
	});	
};


var clickUpdateCommentTree = function clickUpdateCommentTree(event){
	event.preventDefault();
	//console.log(this)
	var $this = $(this);
	var template = $("#comment-update-template").html();
	var $commentFormContainer = $this.parent().siblings(".comment-form-container");
	var $form = $(template);
	$commentFormContainer.html($form);
	
	


	$.ajax({
		url: $this.attr("href"),
		method: 'GET',
		success: function(data){
			
			$form.find(".form-inputs").html(data);			
			
			var action = $this.attr("href");
			$form.attr("action", action);

		},
		error: function(jqXHR, textStatus, errorThrown){
			$form.find("div.error-display").html(jqXHR.responseText);
			
		}
	});	
	

};


var updateCommentFormSubmission = function updateCommentFormSubmission(event){
	
	event.preventDefault();
	var $form = $(this);
	var $formContainer = $form.parents("div.comment-form-container");
	//console.log($form.serialize())
	var $comment = $formContainer.siblings("div.comment");
	//console.log($this.siblings("ul"))
	
	$.ajax({
		url: $form.attr("action"),
		method: 'POST',
		data: $form.serialize(),
		success: function(data){
			
			$formContainer.empty();
			
			$comment.html(data);

		},
		error: function(jqXHR, textStatus, errorThrown){
			console.log(arguments);
			$form.find("div.error-display").html(jqXHR.responseText);
		}
	});	
};

var deleteCommentFormSubmission = function deleteCommentFormSubmission(event){
	
	event.preventDefault();
	console.log(this);
	var $form = $(this);
	var $comment = $form.parents("div.comment");
	
	$.ajax({
		url: $form.attr("action"),
		method: 'POST',
		data: $form.serialize(),
		success: function(data){
			
			$comment.empty();
			
			$comment.html(data);

		},
		error: function(jqXHR, textStatus, errorThrown){
			console.log(arguments);
			$form.find("div.error-display").html(jqXHR.responseText);
		}
	});	
};

$(document).ready(function(){

	var $commentTree = $('.comment-tree');

	$commentTree.on("click", "a.comment-reply-anchor", clickReplyCommentTree);
	$commentTree.on("click", "a.comment-update-anchor", clickUpdateCommentTree);
	
	var $formContainer = $('.comment-form-container');
	$commentTree.on("submit", ".comment-form-container form.comment-create-form", createCommentFormSubmission);
	$commentTree.on("submit", ".comment-form-container form.comment-update-form", updateCommentFormSubmission);
	$commentTree.on("submit", ".comment form.comment-delete-form", deleteCommentFormSubmission);



});


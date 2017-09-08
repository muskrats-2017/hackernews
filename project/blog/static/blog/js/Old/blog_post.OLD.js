'use strict';

//TODO: REMOVE CREATE AJAX FUNCTION
var createAJAXForm = function createAJAXForm(options){
	options = options || {};
	var self = {};

	self.getForm = options.getForm || function(){};

	self.onSubmit = options.onSubmit || function onSubmit($form, onSuccess, onError){
		var self = this;

		$.ajax({
			url: $form.attr("action"),
			method: $form.attr("method"),
			data: $form.serialize(),
			success: onSuccess || self.onSuccess,
			error: onError || self.onError
		});
	};

	self.onSuccess = options.onSuccess || function(){};

	self.onError = options.onError || function(){};

	return self;
};

$(document).ready(function(){



	var 
		$postDetail, $postFormContainer, createCommentForm, 
		$postUpdate, $postUpdateContainer, updatePostForm;

	
	$postDetail = $('div.post');

	$postFormContainer = $('div.post-form-container');
	
	createCommentForm = createAJAXForm({
		"getForm": function(action){
			var 
				template = $("#comment-create-template").html(),
				$el = $(template);
			
			if (action) {
				$el.attr("action", action);
			}
			return $el;
		}
	});

	$postDetail.on("click", "a.comment-create-anchor", function(event){
		event.preventDefault();
		var $this = $(this);
		var $commentFormContainer = $this.parent().siblings(".post-form-container");
		var $form = createCommentForm.getForm($this.attr("href"));

		$commentFormContainer.html($form);
	});

	$postFormContainer.on("submit", "form.comment-create-form", function(event){
		event.preventDefault();
		var $form = $(this);
		
		createCommentForm.onSubmit(
			$form, 
			function(data){
				var commentFormContainer = $form.parents(".post-form-container");
				commentFormContainer.empty();
				commentFormContainer.siblings("ul").append("<li>" + data + "</li>");
			}, 
			function(jqXHR, textStatus, errorThrown){
				$form.find("div.error-display").html(jqXHR.responseText);
			}
		);
	});

	$postDetail = $("div.post");

	$postFormContainer = $('div.post-form-container');
	
	updatePostForm = createAJAXForm({
		"getForm": function(action){
			var 
				template = $("#post-update-template").html(),
				$el = $(template);

			$.ajax({
				url: action,
				method: 'GET',
				success: function(data){
					$el.find(".form-inputs").html(data);
					$el.attr("action", action);
				},
				error: function(jqXHR, textStatus, errorThrown){
					$el.find("div.error-display").html(jqXHR.responseText);
				}
			});

			return $el;
		}
	});
	
	$postDetail.on("click", "a.post-update-anchor", function(event){
		event.preventDefault();
		var $this = $(this);
		var $postFormContainer = $this.parent().siblings(".post-form-container");
		
		var $form = updatePostForm.getForm($this.attr("href"));
		
		$postFormContainer.html($form);
	});

	$postFormContainer.on("submit", "form.post-update-form", function(event){
		event.preventDefault();
		var $form = $(this);
		console.log("hiiiiiiiiii")
		updatePostForm.onSubmit(
			$form, 
			function(data){
				var postFormContainer = $form.parents(".post-form-container");
				postFormContainer.empty();
				postFormContainer.siblings("div.post").html(data);
			}, function(jqXHR, textStatus, errorThrown){
				$form.find("div.error-display").html(jqXHR.responseText);
			}
		);
	});		
});


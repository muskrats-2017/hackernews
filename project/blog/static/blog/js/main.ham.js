'use strict';
//Code taken from Billy's demo on Friday  
//with attempts to reformat for Hackernews


var createForm = function createForm(options){
	var self = {};

	self.getForm = options.getForm || function(){};

	self.onSubmit = options.onSubmit || function(){};

	self.onSuccess = options.onSuccess || function(){};

	self.onError = options.onError || function(){};

	return self;
};

$(document).ready(function(){
	var $commentTree, deleteCommentForm, createCommentForm, updateCommentForm;
	
	$commentTree = $('.comment-tree');

	createCommentForm = createForm({
		"getForm": function(action){
			var 
				template = $("#comment-reply-template").html(),
				$el = $(template);
			
			if (action) {
				$el.attr("action", action);
			}
			return $el;
		},
		"onSubmit": function($form, onSuccess, onError){
			var self = this;

			$.ajax({
				url: $form.attr("action"),
				method: $form.attr("method"),
				data: $form.serialize(),
				success: onSuccess || self.onSuccess,
				error: onError || self.onError
			});
		}
	});

	$commentTree.on("click", "a.comment-reply-anchor", function(event){
		var $this = $(this);
		var $commentFormContainer = $this.parent().siblings(".comment-form-container");
		var $form = createCommentForm.getForm($this.attr("href"));

		$commentFormContainer.html($form);
	});

	$commentTree.on("submit", ".comment-form-container form.comment-create-form", function(event){
		event.preventDefault();
		var $form = $(this);
		
		createCommentForm.onSubmit(
			$form, 
			function(data){
				var commentFormContainer = $form.parents(".comment-form-container");
				commentFormContainer.empty();
				createCommentForm.$el = null;
				commentFormContainer.siblings("ul").append("<li>" + data + "</li>");
			}, 
			function(jqXHR, textStatus, errorThrown){
				$form.find("div.error-display").html(jqXHR.responseText);
			}
		);
	});

	updateCommentForm = createForm({
		"getForm": function(action){
			var 
				template = $("#comment-update-template").html(),
				$el = $(template);

			$.ajax({
				url: action,
				method: 'GET',
				success: function(data){
					$el.attr("action", action);
					$el.find(".form-inputs").html(data);
				},
				error: function(jqXHR, textStatus, errorThrown){
					$el.find("div.error-display").html(jqXHR.responseText);
				}
			});

			return $el;
		},
		"onSubmit": function($form, onSuccess, onError){
			var self = this;

			$.ajax({
				url: $form.attr("action"),
				method: $form.attr("method"),
				data: $form.serialize(),
				success: onSuccess || self.onSuccess,
				error: onError || self.onError
			});
		}
	});

	$commentTree.on("click", "a.comment-update-anchor", function(event){
		var $this = $(this);
		var $commentFormContainer = $this.parent().siblings(".comment-form-container");
		var $form = updateCommentForm.getForm($this.attr("href"));
		$commentFormContainer.html($form);
	});

	$commentTree.on("submit", ".comment-form-container form.comment-update-form", function(event){
		event.preventDefault();
		var $form = $(this);
		updateCommentForm.onSubmit(
			$form, 
			function(data){
				var commentFormContainer = $form.parents(".comment-form-container");
				commentFormContainer.empty();
				commentFormContainer.siblings("div.comment").html(data);
			}, function(jqXHR, textStatus, errorThrown){
				$form.find("div.error-display").html(jqXHR.responseText);
			}
		);
	});
	
	deleteCommentForm = createForm({
		"onSubmit": function($form, onSuccess, onError){
			var self = this;

			$.ajax({
				url: $form.attr("action"),
				method: $form.attr("method"),
				data: $form.serialize(),
				success: onSuccess || self.onSuccess,
				error: onError || self.onError
			});
		}
	});

	$commentTree.on("submit", ".comment form.comment-delete-form", function(event){
		event.preventDefault();
		var $form = $(this);
		deleteCommentForm.onSubmit(
			$form,
			function(data){
				var $comment = $form.parents("div.comment");
				$comment.empty();
				$comment.html(data);
			}, 
			function(jqXHR, textStatus, errorThrown){
				$form.find("div.error-display").html(jqXHR.responseText);
			}
		);
	});

});
'use strict';
//Code taken from Billy's demo on Friday  
//with attempts to reformat for Hackernews


var createForm = function createForm(options){
	var self = {};

	self.getTemplate = options.getTemplate || function(){};

	self.onSubmit = options.onSubmit || function(){};

	self.onSuccess = options.onSuccess || function(){};

	self.onError = options.onError || function(){};

	return self;
};

$(document).ready(function(){

	var $commentTree = $('.comment-tree');

	var createCommentForm = createForm({
		"getTemplate": function($target, action){
			var 
				template = $("#comment-reply-template").html();
			
			this.$target = $target;
			this.$el = $(template);
			this.$el.attr("action", action);
			$target.html(this.$el);
		},
		"onSubmit": function($form){
			var self = this;
			$form = $form || self.$el;
			$.ajax({
				url: $form.attr("action"),
				method: 'POST',
				data: $form.serialize(),
				success: self.onSubmit,
				error: self.onError
			});
		},
		"onSuccess": function(data){
			this.$el = null;
			this.$target.empty();
			this.$target.siblings("ul").append("<li>" + data + "</li>");
		},
		"onError": function(jqXHR, textStatus, errorThrown){
			this.$el.find("div.error-display").html(jqXHR.responseText);
		}
	});

	$commentTree.on("click", "a.comment-reply-anchor", function(event){
		var $this = $(this);
		var $commentFormContainer = $this.parent().siblings(".comment-form-container");
		createCommentForm.getTemplate($commentFormContainer, $this.attr("href"));
	});

	$commentTree.on("submit", ".comment-form-container form.comment-create-form", function(event){
		event.preventDefault();
		createCommentForm.onSubmit($(this));
	});

	var updateCommentForm = createForm({
		"getTemplate": function($target, action){
			var 
				template = $("#comment-update-template").html(),
				self = this;

			self.$target = $target;
			self.$el = $(template);
			self.$target.html(self.$el);

			
			$.ajax({
				url: action,
				method: 'GET',
				success: function(data){
					self.$el.attr("action", action);
					self.$el.find(".form-inputs").html(data);			
					self.$el.attr("action", action);
				},
				error: function(jqXHR, textStatus, errorThrown){
					self.$el.find("div.error-display").html(jqXHR.responseText);				
				}
			});
		},
		"onSubmit": function($form){
			var self = this;
			$form = $form || self.$el;
			$.ajax({
				url: $form.attr("action"),
				method: 'POST',
				data: $form.serialize(),
				success: self.onSubmit,
				error: self.onError
			});
		},
		"onSuccess": function(data){
			this.$el = null;
			this.$target.empty();
			this.$target.siblings("div.comment").html(data);
		},
		"onError": function(jqXHR, textStatus, errorThrown){
			this.$el.find("div.error-display").html(jqXHR.responseText);
		}
	});

	$commentTree.on("click", "a.comment-update-anchor", function(event){
		var $this = $(this);
		var $commentFormContainer = $this.parent().siblings(".comment-form-container");
		updateCommentForm.getTemplate($commentFormContainer, $this.attr("href"));
	});

	$commentTree.on("submit", ".comment-form-container form.comment-update-form", function(event){
		event.preventDefault();
		updateCommentForm.onSubmit($(this));
	});
	
	var deleteCommentForm = createForm({
		"onSubmit": function($form){
			var self = this;
			var $form = $(this);
			self.$comment = $form.parents("div.comment");
	
			$.ajax({
				url: $form.attr("action"),
				method: 'POST',
				data: $form.serialize(),
				success: self.onSuccess,
				error: self.onError
			});
		},
		"onSuccess": function(data){
			this.$comment.empty();
			this.$comment.html(data);
		},
		"onError": function(jqXHR, textStatus, errorThrown){
			this.$el.find("div.error-display").html(jqXHR.responseText);
		}
	});

	$commentTree.on("submit", ".comment form.comment-delete-form", function(event){
		event.preventDefault();
		deleteCommentForm.onSubmit($(this));
	});

});


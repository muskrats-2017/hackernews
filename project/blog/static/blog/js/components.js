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



var mountCommentCreateComponent = function mountCommentCreateComponent($el){

	var createCommentForm = createAJAXForm({
		"getForm": function(action){
			var 
				template = $("#comment-reply-template").html(),
				$el = $(template);
			
			if (action) {
				$el.attr("action", action);
			}
			return $el;
		}
	});

	$el.on("click", "a.comment-reply-anchor", function(event){
		event.preventDefault();
		var $this = $(this);
		var $commentFormContainer = $this.parents(".comment").siblings(".comment-form-container");
		var $form = createCommentForm.getForm($this.attr("href"));

		$commentFormContainer.html($form);
	});

	$el.on("submit", ".comment-form-container form.comment-create-form", function(event){
		event.preventDefault();
		var $form = $(this);
		
		createCommentForm.onSubmit(
			$form, 
			function(data){
				var commentFormContainer = $form.parents(".comment-form-container");
				commentFormContainer.empty();
				commentFormContainer.siblings("ul").append("<li>" + data + "</li>");
			}, 
			function(jqXHR, textStatus, errorThrown){
				$form.find("div.error-display").html(jqXHR.responseText);
			}
		);
	});
};

var mountCommentUpdateComponent = function mountCommentUpdateComponent($el){
	var updateCommentForm = createAJAXForm({
		"getForm": function(action){
			var 
				template = $("#comment-update-template").html(),
				$form = $(template);

			$.ajax({
				url: action,
				method: 'GET',
				success: function(data){
					$form.attr("action", action);
					$form.find(".form-inputs").html(data);
				},
				error: function(jqXHR, textStatus, errorThrown){
					$form.find("div.error-display").html(jqXHR.responseText);
				}
			});

			return $form;
		}
	});

	$el.on("click", "a.comment-update-anchor", function(event){
		event.preventDefault();
		var $this = $(this);
		var $commentFormContainer = $this.parents(".comment").siblings(".comment-form-container");
		
		var $form = updateCommentForm.getForm($this.attr("href"));
		
		$commentFormContainer.html($form);
	});

	$el.on("submit", ".comment-form-container form.comment-update-form", function(event){
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

};

var mountCommentDeleteComponent = function mountCommentDeleteComponent($el){	
	var deleteCommentForm = createAJAXForm();

	$el.on("submit", ".comment form.comment-delete-form", function(event){
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
};


var mountPostCreateCommentComponent = function mountPostCreateCommentComponent($el){
	
	createCommentForm = createAJAXForm({
		"getForm": function(action){
			var 
				template = $("#comment-create-template").html(),
				$form = $(template);
			
			if (action) {
				$form.attr("action", action);
			}
			return $form;
		}
	});

	$el.on("click", "a.comment-create-anchor", function(event){
		event.preventDefault();
		var $this = $(this);
		var $commentFormContainer = $this.parents(".post").siblings(".post-form-container");
		var $form = createCommentForm.getForm($this.attr("href"));

		$commentFormContainer.html($form);
	});

	$el.on("submit", "form.comment-create-form", function(event){
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
};


var mountPostUpdateComponent = function mountPostUpdateComponent($el){
	updatePostForm = createAJAXForm({
		"getForm": function(action){
			var 
				template = $("#post-update-template").html(),
				$form = $(template);

			$.ajax({
				url: action,
				method: 'GET',
				success: function(data){
					$form.find(".form-inputs").html(data);
					$form.attr("action", action);
				},
				error: function(jqXHR, textStatus, errorThrown){
					$form.find("div.error-display").html(jqXHR.responseText);
				}
			});

			return $form;
		}
	});
	
	$el.on("click", "a.post-update-anchor", function(event){
		event.preventDefault();
		var $this = $(this);
		var $postFormContainer = $this.parents(".post").siblings(".post-form-container");
		
		var $form = updatePostForm.getForm($this.attr("href"));
		
		$postFormContainer.html($form);
	});

	$el.on("submit", "form.post-update-form", function(event){
		event.preventDefault();
		var $form = $(this);

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
};


var mountPostDeleteComponent = function mountPostDeleteComponent($el){	
	var deleteCommentForm = createAJAXForm();

	$el.on("submit", ".post form.post-delete-form", function(event){
		event.preventDefault();
		var $form = $(this);
		deleteCommentForm.onSubmit(
			$form,
			function(data){
				var $comment = $form.parents("div.post");
				$comment.empty();
				$comment.html(data);
			}, 
			function(jqXHR, textStatus, errorThrown){
				$form.find("div.error-display").html(jqXHR.responseText);
			}
		);
	});
};

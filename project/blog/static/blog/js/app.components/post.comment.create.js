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

	$el.on("submit", ".post-form-container form.comment-create-form", function(event){
		event.preventDefault();
		var $form = $(this);

		createCommentForm.onSubmit(
			$form, 
			function(data){
				console.log(arguments);
				var commentFormContainer = $form.parents(".post-form-container");
				commentFormContainer.empty();
				var template = $("#comment-detail-template").html();
				var rendered = Mustache.render(template, data);
				commentFormContainer.siblings("ul").append('<li class="list-group-item">' + rendered + '</li>');
			}
		);
	});
};
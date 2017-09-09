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
		var action = createCommentForm.parseAction($this.attr("href"));
		var $form = createCommentForm.getForm(action);

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
				var template = $("#comment-detail-template"	).html();
				var rendered = Mustache.render(template, data);
				commentFormContainer.siblings("ul").append('<li class="list-group-item">' + rendered + '</li>');
			}
		);
	});
};
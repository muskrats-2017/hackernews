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
				var template = $("#comment-detail-template"	).html();
				var rendered = Mustache.render(template, data);
				$comment.html(rendered);
			}
		);
	});
};
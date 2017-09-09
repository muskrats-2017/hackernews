
var mountPostDeleteComponent = function mountPostDeleteComponent($el){	
	var deletePostForm = createAJAXForm();

	$el.on("submit", ".post form.post-delete-form", function(event){
		event.preventDefault();
		var $form = $(this);
		$form.attr("action", deletePostForm.parseAction($form.attr("action"), "blog"));
		deletePostForm.onSubmit(
			$form,
			function(data){
				var $post = $form.parents("div.post");
				$post.empty();
				var template = $("#post-template").html();
				var rendered = Mustache.render(template, data);
				$post.html(rendered);
			}
		);
	});
};

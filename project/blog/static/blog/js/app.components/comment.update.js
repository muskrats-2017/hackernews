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
					var rendered = Mustache.render("{{#.}}{{{.}}}{{/.}}", Object.values(data));
					$form.attr("action", action);
					$form.find(".form-inputs").html(rendered);
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
				var template = $("#comment-detail-template"	).html();
				var rendered = Mustache.render(template, data);
				commentFormContainer.siblings("div.comment").html(rendered);
			}
		);
	});

};

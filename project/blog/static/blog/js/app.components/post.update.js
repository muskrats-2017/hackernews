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
					var rendered = Mustache.render("{{#.}}{{{.}}}{{/.}}", Object.values(data));
					$form.find(".form-inputs").html(rendered);
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
				var template = $("#post-template").html();
				var rendered = Mustache.render(template, data);				
				postFormContainer.siblings("div.post").html(rendered);

			}
		);
	});
};
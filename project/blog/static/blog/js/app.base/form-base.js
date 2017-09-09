var createAJAXForm = function createAJAXForm(options){
	options = options || {};
	var self = {};

	self.getForm = options.getForm || function(){};

	self.errorTemplate = options.errorTemplate || $("#form-error-template").html();


	self.onSubmit = options.onSubmit || function onSubmit($form, onSuccess, onError){
		var self = this;

		$.ajax({
			url: $form.attr("action"),
			method: $form.attr("method"),
			data: $form.serialize(),
			success: onSuccess || self.onSuccess,
			error: onError || self.onError($form)
		});
	};

	self.onSuccess = options.onSuccess || function(){};

	self.onError = options.onError || function onError($form){
		return function(jqXHR, textStatus, errorThrown){
			var 
				rendered = '<p class="text-danger">' + textStatus + '</p>',
				data = {"errors": []};
			
			if (jqXHR.responseJSON){
				let errors = JSON.parse(jqXHR.responseJSON);
				$.each(errors, function(key, value){
					data.errors.push({
						"field": key,
						"errors": value
					});
				});
				rendered = Mustache.render(self.errorTemplate, data);
			}
			$form.find("div.error-display").html(rendered);
		};
	};


	self.parseAction = function parseAction(action, replace){
		var __replace = "/api/" + (replace ?  replace + "/":"");
		return action.replace(/^\/blog\//g, __replace);
	};

	return self;
};
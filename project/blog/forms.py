from django import forms
from django.contrib.auth import get_user_model

from blog.models import Post, Comment


User = get_user_model()

class BaseForm(forms.ModelForm):

	def as_json(self):
		
		data = {}
		input_template = '{label}{field}<span class="helptext">{help_text}</span>'
		for name in self.fields:
			data[name] = input_template.format(
				label=self[name].label_tag(), 
				field=self[name].as_widget(), 
				help_text=self[name].help_text
			)
		return data



class BlogForm(BaseForm):
	
	class Meta:
		model = Post
		fields = ['title', 'content']

class CommentForm(BaseForm):

	class Meta:
		model = Comment
		fields = ['content']

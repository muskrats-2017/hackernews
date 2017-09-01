from django import forms
from django.contrib.auth import get_user_model

from blog.models import Post, Comment


User = get_user_model()

class BlogForm(forms.ModelForm):
	
	class Meta:
		model = Post
		fields = ['title', 'content']

class CommentForm(forms.ModelForm):

	class Meta:
		model = Comment
		fields = ['content']

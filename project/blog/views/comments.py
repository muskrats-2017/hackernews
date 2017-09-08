import datetime
from django.shortcuts import render, redirect, get_object_or_404	
from django.http import HttpResponseNotAllowed, HttpResponse, JsonResponse
from django.utils import timezone
from django.views.generic import View
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models import Q
from django.contrib.contenttypes.models import ContentType


from blog.models import Post, Comment
from blog.forms import BlogForm, CommentForm




class CreateCommentView(LoginRequiredMixin, View):

	form_class = CommentForm
	template_name = 'blog/create-comment.html'
	success_url = 'blog:list'

	def get(self, request, pk):
		post = get_object_or_404(Post, id=pk)
		
		comment_form = self.form_class()
		context = {
			'comment_form': comment_form, 
			'post': post
		}
		return render(request, self.template_name, context)

	def post(self, request, pk):
		post = get_object_or_404(Post, id=pk)
		comment_form = self.form_class(request.POST)
		
		if comment_form.is_valid():
			comment = comment_form.save(commit=False)
			comment.user = request.user
			comment.parent = post
			comment.save()
			context = {
				'comment': comment.to_json()
			}
			response = self.get_response(request, comment_form, context)
			return response or redirect(self.success_url)
		
		else:
			context = {
				'comment_form': comment_form
			}
			response = self.get_response(request, comment_form)
			return response or render(request, self.template_name, context)

	def get_response(self, request, form, context=None):
		if request.is_ajax():
			if form.is_valid():
				return JsonResponse(context)

			else:
				return JsonResponse(form.errors.as_json(), safe=False, status=422)

class UpdateCommentView(LoginRequiredMixin, View):
	
	def get(self, request, comment_pk):
		
		# post_content_type = ContentType.objects.get_for_model(post)
		
		# obj = get_object_or_404(
		# 	Comment, id=comment_pk, 
		# 	user=request.user, parent_id=post.id, parent_type=post_content_type
		# )
		
		obj = get_object_or_404(
			Comment, id=comment_pk, 
			user=request.user
		)

		update_comment_form = CommentForm(instance=obj)

		if request.is_ajax():
			return JsonResponse(update_comment_form.as_json())
		
		context = {
			'comment' : obj,
			'update_comment_form': update_comment_form
		}
		
		return render(request, 'blog/update-comment.html', context)
	
	def post(self, request, comment_pk):
	
		
		# post_content_type = ContentType.objects.get_for_model(post)
		
		# obj = get_object_or_404(
		# 	Comment, id=comment_pk, 
		# 	user=request.user, parent_id=post.id, parent_type=post_content_type
		# )

		obj = get_object_or_404(
			Comment, id=comment_pk, 
			user=request.user
		)
		data = request.POST
		form = CommentForm(data, instance=obj)
	
		if form.is_valid():
			obj = form.save()
			response = self.get_response(request, form, {
				"comment": obj.to_json()
			})
			return response or redirect('blog:list')
		else: 
			context = {
				'comment' : form
			}
			response = self.get_response(request, form)

			return response or render(request, 'blog/update-comment.html', context)

	def get_response(self, request, form, context=None):
		if request.is_ajax() and form.is_valid():
			return JsonResponse(context)

		elif request.is_ajax():
			return JsonResponse(form.errors.as_json(), safe=False, status=422)

class DeleteCommentView(LoginRequiredMixin, View):

	def get(self, request, comment_pk):
		
		# post_content_type = ContentType.objects.get_for_model(post)
		
		# obj = get_object_or_404(
		# 	Comment, id=comment_pk, 
		# 	user=request.user, parent_id=post.id, parent_type=post_content_type
		# )

		user_check = Q(user=request.user) if not request.user.is_staff else Q()

		obj = get_object_or_404(
			Comment, 
			user_check, id=comment_pk
		)
		# post = get_object_or_404(Post, id=pk, created_by=request.user)
		context = {
			'comment': obj
		}
		return render(request, 'blog/delete-comment.html', context)
	

	def post(self, request, comment_pk):
		user_check = Q(user=request.user) if not request.user.is_staff else Q()

		obj = get_object_or_404(
			Comment, 
			user_check, id=comment_pk
		)

		obj.is_hidden = True
		obj.save()
		response = self.get_response(request, {
			"comment": obj.to_json()
		})
		return response or redirect('blog:list')


	def get_response(self, request, context=None):
		if request.is_ajax():
			return JsonResponse(context)





class CreateReplyView(LoginRequiredMixin, View):

	form_class = CommentForm
	template_name = 'blog/create-reply.html'
	success_url = 'blog:list'

	def get(self, request, comment_pk):
		comment = get_object_or_404(Comment, id=comment_pk)
		comment_form = self.form_class()
		context = {
			'comment_form': comment_form,
			'comment': comment
		}

		return render(request, self.template_name, context)

	def post(self, request, comment_pk):
		obj = get_object_or_404(Comment, id=comment_pk)
		comment_form = self.form_class(request.POST)

		if comment_form.is_valid():
			comment = comment_form.save(commit=False)
			comment.user = request.user
			comment.parent = obj
			comment.save()
			context = {
				'comment': comment.to_json()
			}
			response = self.get_response(request, comment_form, context)
			return response or redirect(self.success_url)
		else:
				
			context = {
				'comment_form': comment_form,
				'comment': obj
			}
			response = self.get_response(request, comment_form, context)
			return response or render(request, self.template_name, context)

	def get_response(self, request, form, context=None):
		if request.is_ajax() and form.is_valid():
			return JsonResponse(context)

		elif request.is_ajax():
			return JsonResponse(form.errors.as_json(), safe=False, status=422)










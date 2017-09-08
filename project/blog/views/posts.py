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


class ListBlogView(View):
	#list of all the blog posts on the first page
	def get(self, request):

		posts = Post.objects.all()
		# comments = Comments.objects.filter()
		context = {
			'post_list': posts,
			# 'comments': comments
		}
		return render(request, 'blog/list.html', context)

class CreateBlogView(LoginRequiredMixin, View):
	

	form_class = BlogForm
	template_name = 'blog/createblog.html'
	success_url = 'blog:list'


	def get(self, request):
		blog_form = self.form_class()
		return render(request, self.template_name, {'blog_form': blog_form})


	def post(self, request):
		blog_form = self.form_class(request.POST)
		if blog_form.is_valid():
			post = blog_form.save(commit=False)
			post.created_by = request.user
			post.save()
			return redirect(self.success_url)
		
		else:
			
			return render(request, self.template_name, {'blog_form': blog_form})

class UpdateBlogView(LoginRequiredMixin, View):
	
	def get(self, request, pk):
		obj = get_object_or_404(Post, pk=pk, created_by=request.user)
		# post_content_type = ContentType.objects.get_for_model(post)
		
		# obj = get_object_or_404(
		# 	Comment, id=comment_pk, 
		# 	user=request.user, parent_id=post.id, parent_type=post_content_type
		# )

		update_post_form = BlogForm(instance=obj)

		if request.is_ajax():
			return JsonResponse(update_post_form.as_json())

		context = {
			'post' : obj,
			'update_blog_form': update_post_form
		}

		return render(request, 'blog/update.html', context)

	def post(self, request, pk):
		obj = get_object_or_404(Post, pk=pk, created_by=request.user)
		data = request.POST
		form = BlogForm(data, instance=obj)
		if form.is_valid():
			form.save()
			response = self.get_response(request, form, {
				"post": obj.to_json()
			})			
			return response or redirect('blog:list')
		else: 
			context = {
				'post' : obj,
				'update_blog_form': form
			}
			response = self.get_response(request, form)			
			return response or render(request, 'blog/update.html', context)		

	def get_response(self, request, form, context=None):
		if request.is_ajax() and form.is_valid():
			return JsonResponse(context)

		elif request.is_ajax():
			return JsonResponse(form.errors.as_json(), safe=False, status=422)			

class DeleteBlogView(LoginRequiredMixin, View):

	def get(self, request, pk):
		user_check = Q(created_by=request.user) if not request.user.is_staff else Q()

		post = get_object_or_404(Post, user_check, id=pk)
		context = {'post': post}
		return render(request, 'blog/delete.html', context)
	

	def post(self, request, pk):
		user_check = Q(created_by=request.user) if not request.user.is_staff else Q()
		
		post = get_object_or_404(Post, user_check, id=pk)
		
		post.is_hidden = True

		post.save()
		
		response = self.get_response(request, {
			"post": post.to_json()
		})

		return response or redirect('blog:list')

	def get_response(self, request, context=None):
		if request.is_ajax():
			return JsonResponse(context)


		
class DetailView(LoginRequiredMixin, View):

	def get(self, request, pk):

		post = get_object_or_404(Post, id=pk)
		comments = post.comment_set.all()
		# post_content_type = ContentType.objects.get_for_model(post)
		# comments = Comment.objects.filter(parent_id=post.id, parent_type=post_content_type)
		context = {
			'post': post,
			'comments': comments,
			'comment_form':CommentForm()
		}
		return render(request, 'blog/detail.html', context)
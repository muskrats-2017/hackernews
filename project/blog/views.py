import datetime
from django.shortcuts import render, redirect, get_object_or_404	
from django.http import HttpResponseNotAllowed
from django.utils import timezone
from django.views.generic import View
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models import Q
from django.contrib.contenttypes.models import ContentType


from blog.models import Post, Comment
from blog.forms import BlogForm, CommentForm




# Create your views here.
class IndexView(View):

	def get(self, request):
		return render(request, 'blog/index.html')

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

		update_blog_form = BlogForm(instance=obj)

		context = {
			'post' : obj,
			'update_blog_form': update_blog_form
		}

		return render(request, 'blog/update.html', context)

	def post(self, request, pk):
		obj = get_object_or_404(Post, pk=pk, created_by=request.user)
		data = request.POST
		form = BlogForm(data, instance=obj)
		if form.is_valid():
			form.save()
			return redirect('blog:list')
		else: 
			context = {
				'post' : obj,
				'update_blog_form': form
			}
			print(context['post'])
			return render(request, 'blog/update.html', context)		

class DeleteBlogView(LoginRequiredMixin, View):

	def get(self, request, pk):
		post = get_object_or_404(Post, id=pk, created_by=request.user)
		context = {'post': post}
		return render(request, 'blog/delete.html', context)
	

	def post(self, request, pk):
		post = get_object_or_404(Post, id=pk, created_by=request.user)
		
		post.delete()	
		return redirect('blog:list')

class DetailView(LoginRequiredMixin, View):

	def get(self, request, pk):

		post = get_object_or_404(Post, id=pk)
		comments = post.comment_set.all()
		# post_content_type = ContentType.objects.get_for_model(post)
		# comments = Comment.objects.filter(parent_id=post.id, parent_type=post_content_type)
		context = {
			'post': post,
			'comments': comments
		}
		return render(request, 'blog/detail.html', context)

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
			return redirect(self.success_url)
		
		else:
			context = {
				'comment_form': comment_form
			}
			return render(request, self.template_name, context)

class UpdateCommentView(LoginRequiredMixin, View):
	
	def get(self, request, pk, comment_pk):
		post = get_object_or_404(Post, pk=pk)
		# post_content_type = ContentType.objects.get_for_model(post)
		
		# obj = get_object_or_404(
		# 	Comment, id=comment_pk, 
		# 	user=request.user, parent_id=post.id, parent_type=post_content_type
		# )
		
		obj = get_object_or_404(
			Comment, id=comment_pk, 
			user=request.user, post__id=post.id
		)

		update_comment_form = CommentForm(instance=obj)
		

		context = {
			'comment' : obj,
			'post' : post,
			'update_comment_form': update_comment_form
		}


		return render(request, 'blog/update-comment.html', context)
	
	def post(self, request, pk, comment_pk):
		post = get_object_or_404(Post, pk=pk)
		
		# post_content_type = ContentType.objects.get_for_model(post)
		
		# obj = get_object_or_404(
		# 	Comment, id=comment_pk, 
		# 	user=request.user, parent_id=post.id, parent_type=post_content_type
		# )

		obj = get_object_or_404(
			Comment, id=comment_pk, 
			user=request.user, post__id=post.id
		)
		data = request.POST
		form = CommentForm(data, instance=obj)
		if form.is_valid():
			form.save()
			return redirect('blog:list')
		else: 
			context = {
				'comment' : form
			}

			return render(request, 'blog/update-comment.html', context)

class DeleteCommentView(LoginRequiredMixin, View):

	def get(self, request, pk, comment_pk):

		post = get_object_or_404(Post, pk=pk)
		
		# post_content_type = ContentType.objects.get_for_model(post)
		
		# obj = get_object_or_404(
		# 	Comment, id=comment_pk, 
		# 	user=request.user, parent_id=post.id, parent_type=post_content_type
		# )

		user_check = Q(user=request.user) | Q(post__created_by=request.user)

		obj = get_object_or_404(
			Comment, 
			user_check, id=comment_pk, post__id=post.id
		)
		print(Comment.objects.filter(user_check, id=comment_pk, post__id=post.id).query)
		# post = get_object_or_404(Post, id=pk, created_by=request.user)
		context = {
			'post': post,
			'comment': obj

		}
		return render(request, 'blog/delete-comment.html', context)
	

	def post(self, request, pk, comment_pk):
		post = get_object_or_404(Post, pk=pk)
		
		comment = get_object_or_404(
			Comment, id=comment_pk, 
			user=request.user, post__id=post.id
		)

		comment.delete()	
		return redirect('blog:list')

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
			return redirect(self.success_url)
		else:

			context = {
				'comment_form': comment_form,
				'comment': obj
			}
			return render(request, self.template_name, context)
















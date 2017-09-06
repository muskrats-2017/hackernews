from django.db import models
from django.utils import timezone
from django.utils.text import slugify
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation
from django.contrib.contenttypes.models import ContentType


# Create your models here.
User = get_user_model()

class Post(models.Model):
	title = models.CharField(max_length=30)
	slug = models.SlugField(max_length=50)
	content = models.TextField()
	created_at = models.DateTimeField(default=timezone.now)
	updated_at = models.DateTimeField(default=timezone.now)
	created_by = models.ForeignKey(User)

	comment_set = GenericRelation(
		'blog.Comment', 
		object_id_field='parent_id', 
		content_type_field='parent_type',
		related_query_name='post'
	)


	def __str__(self):
		return self.title

	def clean(self):
		self.slug = slugify(self.title)

	def save(self, *args, **kwargs):
		self.full_clean()
		super().save(*args, **kwargs)

class Comment(models.Model):
	content = models.TextField()
	timestamp = models.DateTimeField(default=timezone.now)
	user = models.ForeignKey(User)
	

	is_hidden = models.BooleanField(default=False)
	parent_id = models.PositiveIntegerField()
	parent_type = models.ForeignKey(ContentType)
	parent = GenericForeignKey('parent_type','parent_id')



	comment_set = GenericRelation(
		'blog.Comment', 
		object_id_field='parent_id', 
		content_type_field='parent_type',
		related_query_name='comments'
	)

# class PostVote(models.Model):
# 	post = models.ForeignKey(Post)
# 	user = models.ForeignKey(User)

# class CommentVote(models.Model):
# 	user = models.ForeignKey(User)
# 	comment = models.ForeignKey(Comment)


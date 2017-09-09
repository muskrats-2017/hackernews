from django.conf.urls import url


from blog import api_views as views



urlpatterns = [
	# url(r'^blog$', views.ListBlogView.as_view(), name='list'),
	# url(r'^blog/create$', views.CreateBlogView.as_view(), name='create'),
	# url(r'^blog/(?P<pk>\d+)$', views.DetailView.as_view(), name='detail'),
	url(r'^blog/(?P<pk>\d+)/update$', views.UpdateBlogView.as_view(), name='update'),
	url(r'^blog/(?P<pk>\d+)/delete$', views.DeleteBlogView.as_view(), name='delete'),
	url(r'^blog/(?P<pk>\d+)/comments$', views.CreateCommentView.as_view(), name='create-comment'),
	url(r'^comments/(?P<comment_pk>\d+)/update$', views.UpdateCommentView.as_view(), name='update-comment'),
	url(r'^comments/(?P<comment_pk>\d+)/delete$', views.DeleteCommentView.as_view(), name='delete-comment'),
	url(r'^comments/(?P<comment_pk>\d+)/reply$', views.CreateReplyView.as_view(), name='reply-view'),
]
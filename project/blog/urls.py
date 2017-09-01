from django.conf.urls import url


from blog import views



urlpatterns = [
	url(r'^$', views.ListBlogView.as_view(), name='list'),
	url(r'^create$', views.CreateBlogView.as_view(), name='create'),
	url(r'^(?P<pk>\d+)$', views.DetailView.as_view(), name='detail'),
	url(r'^(?P<pk>\d+)/comments$', views.CreateCommentView.as_view(), name='create-comment'),
	url(r'^(?P<pk>\d+)/comments/(?P<comment_pk>\d+)/update$', views.UpdateCommentView.as_view(), name='update-comment'),
	url(r'^(?P<pk>\d+)/comments/(?P<comment_pk>\d+)/delete$', views.DeleteCommentView.as_view(), name='delete-comment'),
	url(r'^comments/(?P<comment_pk>\d+)/reply$', views.CreateReplyView.as_view(), name='reply-view'),
	url(r'^(?P<pk>\d+)/update$', views.UpdateBlogView.as_view(), name='update'),
	url(r'^(?P<pk>\d+)/delete$', views.DeleteBlogView.as_view(), name='delete')
]





# url(r'^create$', views.CreateView.as_view(form_class=BlogForm), name='create'),
# 	url(r'^list$', views.ListView.as_view(), name='list'),
# 	url(r'^(?P<pk>\d+)$', views.DetailView.as_view(), name='detail'),
# 	url(r'^(?P<pk>\d+)/delete$', views.DeleteView.as_view(), name='delete'),
# 	url(r'^(?P<pk>\d+)/update$', views.UpdateView.as_view(), name='update'),
# 	url(r'^(?P<pk>\d+)/comments$', views.CreateCommentView.as_view(), name='create-comment'),
# 	url(r'^comments/(?P<comment_pk>\d+)/update$', views.UpdateCommentView.as_view(), name='update-comment'),
# 	url(r'^comments/(?P<comment_pk>\d+)/delete$', views.DeleteCommentView.as_view(), name='delete-comment'),
# 	url(r'^comments/(?P<comment_pk>\d+)/reply$', views.CreateReplyView.as_view(), name='reply-view')
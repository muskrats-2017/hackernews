from django import template

register = template.Library()

@register.inclusion_tag('blog/__post-detail-snippet.html')
def post_detail(post, comments):
    return {
        "post": post,
        "comments": comments
    }

@register.inclusion_tag('blog/__post-snippet.html')
def get_post(post):
    return {
        "post": post
    }


@register.inclusion_tag('blog/__comment-detail-snippet.html')
def get_comment_detail(comment):
	if comment.comment_set.exists():
		comments = comment.comment_set.all()
	else:
		comments = []	

	return {
		"comment": comment,
		"comments": comments

	}

@register.inclusion_tag('blog/__comment-snippet.html')
def get_comment(comment):
	return { "comment": comment }
	


from .comments import *
from .posts import *


# Create your views here.
class IndexView(View):

	def get(self, request):
		return render(request, 'blog/index.html')

"use strict";

$(document).ready(function(){
	var 
		$postDetail = $('.post-detail'),
		$commentTree = $('.comment-tree');
	
	// Mount Create Post Component To $postDeatil
	mountPostCreateCommentComponent($postDetail);

	// Mount Update Post Component To $postDeatil
	mountPostUpdateComponent($postDetail);

	// Mount Delete Post Component To $postDeatil
	mountPostDeleteComponent($postDetail);

	// Mount Create Comment Component To $commentDetail
	mountCommentCreateComponent($commentTree);

	// Mount Update Comment Component To $commentDetail
	mountCommentUpdateComponent($commentTree);

	// Mount Delete Comment Component To $commentTree
	mountCommentDeleteComponent($commentTree);


});
//http://jsoneditoronline.org/
//http://jsonmate.com/
//https://www.thomasfrank.se/downloadableJS/JSONeditor_example.html
//http://www.alkemis.com/johnsonRod/

/*
All resources has these common fields:
id, creatorId, ownerId, dateCreated, dateModified, deleted, dateDeleted, note

User		:(username, displayName, password, FirstName, lastName, email, isSuspended)
Article		:(title, bodyText, publishedDate, authorId, imageURL, note, isDraft, isModerated)
Comment		:(commentText, authorId, repliedTo, articleId)
Like		:(userId, articleId)
Rate		:(userId, articleId, value)
tag			:(tagText, articleId)
Favourite	:(userId, articleId)
Follower	:(fellowerId, FelloweeId)

Roles:
- Admin:(can create/retrieve/update/delete any resource)
- PublicGuest:(can read any article and comment, can read any User displayName, can read likes and rates on articles)
- Moderator:(can delete comments, can set any article isModerated, isDraft, can set is suspended on User )
- Author:(can add article, can like, comment and fav any article, can follow any other user, can tag only his own articles)
- PaidAuthor:(extends author, can rate other people articles, can tag other people articles, can delete any comment on his articles)

other policies:
- No user can rate his own article
- No user can update his own isSuspended property	

*/
const fs = require('fs');

//---------------------------------------------------
//                 Admin
//---------------------------------------------------
//Admin policies
var pa_readAny   = {action:"read",   records:"any", fields:"*", limit:{amount:-1, rule:""}};
var pa_createAny = {action:"create", records:"any", fields:"*", limit:{amount:-1, rule:""}};
var pa_updateAny = {action:"update", records:"any", fields:"*", limit:{amount:-1, rule:""}};
var pa_deleteAny = {action:"delete", records:"any", fields:"*", limit:{amount:-1, rule:""}};

//Admin resources
var admin_article = {resource:"Article", policies:[
		pa_readAny, pa_createAny, pa_updateAny, pa_deleteAny]};

var admin_comment = {resource:"Comment", policies:[
		pa_readAny, pa_createAny, pa_updateAny, pa_deleteAny]};	

var admin_user = {resource:"User", policies:[
		pa_readAny, pa_createAny, pa_updateAny, pa_deleteAny]};	

var admin_like = {resource:"Like", policies:[
		pa_readAny, pa_createAny, pa_updateAny, pa_deleteAny]};		

var admin_rate = {resource:"Rate", policies:[
		pa_readAny, pa_createAny, pa_updateAny, pa_deleteAny]};

var admin_tag = {resource:"Tag", policies:[
		pa_readAny, pa_createAny, pa_updateAny, pa_deleteAny]};

var admin_favourite = {resource:"Favourite", policies:[
		pa_readAny, pa_createAny, pa_updateAny, pa_deleteAny]};	

var admin_follower = {resource:"Follower", policies:[
		pa_readAny, pa_createAny, pa_updateAny, pa_deleteAny]};			

//Admin role		
var admin_role = {role:"Admin", inherits:"", grant:[
		admin_article, admin_comment, admin_user, admin_like, admin_rate,
		admin_tag, admin_favourite, admin_follower]};  
		
//---------------------------------------------------
//                 PublicGuest
//---------------------------------------------------
//PublicGuest policies
var pg_articleReadPolicy = {action:"read", records:"any", fields:"title, bodyText, publishedDate, authorId, imageURL", limit:{amount:-1, rule:""}};
var pg_userReadPolicy = {action:"read",   records:"$resource.roleId!=1/i&$resource.roleId!=3/i", fields:"displayName", limit:{amount:-1, rule:""}};
var pg_commentReadPolicy = {action:"read",   records:"any", fields:"commentText, authorId, repliedTo", limit:{amount:-1, rule:""}};
var pg_likeReadPolicy = {action:"read",   records:"any", fields:"userId, articleId", limit:{amount:-1, rule:""}};
var pg_tagReadPolicy = {action:"read",   records:"any", fields:"tagText, articleId", limit:{amount:-1, rule:""}};
var pg_followerReadPolicy = {action:"read",   records:"any", fields:"fellowerId, FelloweeId", limit:{amount:-1, rule:""}};	

//PublicGuest resources
var pg_article = {resource:"Article", policies:[pg_articleReadPolicy]};
var pg_user = {resource:"User", policies:[pg_userReadPolicy]};
var pg_comment = {resource:"Comment", policies:[pg_commentReadPolicy]};
var pg_like = {resource:"Like", policies:[pg_likeReadPolicy]};
var pg_tag = {resource:"Tag", policies:[pg_tagReadPolicy]};
var pg_follower = {resource:"Follower", policies:[pg_followerReadPolicy]};

//PublicGuest role
var pg_role = {role:"PublicGuest", inherits:"", grant:[pg_article, pg_user, pg_comment, pg_like, pg_tag, pg_follower]};  

//---------------------------------------------------
//                 Author
//---------------------------------------------------
//Author Policies
var auth_createArticle 	  =	{action:"create", records:"any", fields:"*", limit:{amount:-1, rule:""}};
var auth_updateArticle    =	{action:"update", records:"$resource.authorId=$user.id", fields:"*", limit:{amount:-1, rule:""}};
var auth_deleteArticle    =	{action:"delete", records:"$resource.authorId=$user.id", fields:"*", limit:{amount:-1, rule:""}};
var auth_readOwnArticle   =	{action:"read", records:"$resource.authorId=$user.id", fields:"title, bodyText, publishedDate, authorId, imageURL, note, isDraft, isModerated", limit:{amount:-1, rule:""}};
var auth_readOtherArticle = {action:"read", records:"$resource.authorId!=$user.id", fields:"title, bodyText, publishedDate, authorId, imageURL", limit:{amount:-1, rule:""}};

var auth_createLike = {action:"create", records:"any", fields:"*", limit:{amount:-1, rule:""}};
var auth_deleteLike = {action:"delete", records:"$resource.authorId!=$user.id", fields:"*", limit:{amount:-1, rule:""}};
var auth_getLike = {action:"read", records:"any", fields:"*", limit:{amount:-1, rule:""}};

var auth_createComment = {action:"create", records:"any", fields:"*", limit:{amount:-1, rule:""}};
var auth_updateComment = {action:"update", records:"resource.authorId=$user.id", fields:"*", limit:{amount:-1, rule:""}};
var auth_readComment = {action:"read", records:"any", fields:"*", limit:{amount:-1, rule:""}};
var auth_deleteComment = {action:"delete", records:"resource.authorId=$user.id", fields:"*", limit:{amount:-1, rule:""}};

var auth_createFavourite = {action:"create", records:"any", fields:"*", limit:{amount:-1, rule:""}};
var auth_deleteFavourite = {action:"delete", records:"$resource.authorId!=$user.id", fields:"*", limit:{amount:-1, rule:""}};
var auth_readFavourite = {action:"read", records:"$resource.authorId!=$user.id", fields:"*", limit:{amount:-1, rule:""}};

var auth_createFollower = {action:"create", records:"any", fields:"*", limit:{amount:-1, rule:""}};
var auth_deleteFollower = {action:"delete", records:"$resource.authorId!=$user.id", fields:"*", limit:{amount:-1, rule:""}};
var auth_readFollower = {action:"read", records:"any", fields:"*", limit:{amount:-1, rule:""}};

var auth_createTag = {action:"create", records:"SELECT * FROM Article WHERE Article.Id=$resource.articleId AND Article.authorId=$user.id", fields:"*", limit:{amount:-1, rule:""}};
var auth_updateTag = {action:"update", records:"SELECT * FROM Article WHERE Article.Id=$resource.articleId AND Article.authorId=$user.id", fields:"*", limit:{amount:-1, rule:""}};
var auth_deleteTag = {action:"delete", records:"SELECT * FROM Article WHERE Article.Id=$resource.articleId AND Article.authorId=$user.id", fields:"*", limit:{amount:-1, rule:""}};
var auth_readTag = {action:"read", records:"SELECT * FROM Article WHERE Article.Id=$resource.articleId AND Article.authorId=$user.id", fields:"*", limit:{amount:-1, rule:""}};
	
//Author resources
var auth_article = {resource:"Article", policies:[auth_createArticle, auth_updateArticle, auth_deleteArticle, auth_readOwnArticle, auth_readOtherArticle]};
var auth_like = {resource:"Like", policies:[auth_createLike,auth_deleteLike,auth_getLike]};
var auth_comment = {resource:"Comment", policies:[auth_createComment,auth_updateComment,auth_readComment,auth_deleteComment]};
var auth_favourite = {resource:"Favourite", policies:[auth_createFavourite,auth_deleteFavourite,auth_readFavourite]};
var auth_follower = {resource:"Follower", policies:[auth_createFollower,auth_deleteFollower,auth_readFollower]};
var auth_tag = {resource:"Tag", policies:[auth_createTag,auth_updateTag,auth_deleteTag,auth_readTag]};


//Author role
var auth_role = {role:"Author", inherits:"", grant:[auth_article,auth_like,auth_comment,auth_favourite,auth_follower,auth_tag]}; 


//---------------------------------------------------
//                 PaidAuthor
//---------------------------------------------------
//PaidAuthor policies
var pauth_createRate ={action:"create", records:"SELECT * FROM Article WHERE Article.authorId!=$user.id", fields:"*", limit:{amount:-1, rule:""}};
var pauth_deleteRate ={action:"delete", records:"SELECT * FROM Article WHERE Article.Id=$resource.articleId AND Article.Id=$user.id", fields:"*", limit:{amount:-1, rule:""}};
var pauth_readRate ={action:"read", records:"any", fields:"*", limit:{amount:-1, rule:""}};

var pauth_createTag ={action:"create", records:"SELECT * FROM Article WHERE Article.authorId!=$user.id", fields:"*", limit:{amount:-1, rule:""}};
var pauth_updateTag = {action:"update", records:"SELECT * FROM Article WHERE Article.Id=$resource.articleId AND Article.authorId=$user.id", fields:"*", limit:{amount:-1, rule:""}};
var pauth_deleteTag ={action:"delete", records:"SELECT * FROM Article WHERE Article.Id=$resource.articleId AND Article.Id!=$user.id", fields:"*", limit:{amount:-1, rule:""}};
var pauth_readRTag ={action:"read", records:"any", fields:"*", limit:{amount:-1, rule:""}};

var pauth_deleteComment ={action:"delete", records:"SELECT * FROM Article WHERE Article.authorId=$user.id", fields:"*", limit:{amount:-1, rule:""}};


//PaidAuthor resources

var pauth_rate = {resource:"Rate", policies:[pauth_createRate,pauth_deleteRate,pauth_readRate]};
var pauth_comment = {resource:"Comment", policies:[pauth_deleteComment]};
var pauth_tag = {resource:"Tag", policies:[pauth_createTag,pauth_updateTag,pauth_deleteTag,pauth_readRTag]};



//PaidAuthor role

var pauth_role = {role:"PaidAuthor", inherits:"Author", grant:[pauth_rate,pauth_comment,pauth_tag]}; 

//---------------------------------------------------
//              Moderator   
//---------------------------------------------------
// Moderator Policies
var mod_deleteComment = {action:"delete", records:"resource.roleId=3", fields:"*", limit:{amount:-1, rule:""}};
var mod_setArticle = {action:"create", records:"any", fields:"isModerated,isDraft", limit:{amount:-1, rule:""}};
var mod_setUser = {action:"create", records:"any", fields:"isSuspended", limit:{amount:-1, rule:""}};


// Moderator resources
var mod_article = {resource:"Article", policies:[mod_setArticle]};
var mod_user = {resource:"User", policies:[mod_setUser]};
var mod_comment = {resource:"Comment", policies:[mod_deleteComment]};


// Moderator role
var mod_role = {role:"Moderator", inherits:"", grant:[mod_article, mod_user, mod_comment]};



//---------------------------------------------------
//                 Final Schema
//---------------------------------------------------
var schema = {accesscontrol:[admin_role, pg_role,auth_role,pauth_role]};

fs.writeFile("oktob_rbac.json", JSON.stringify(schema), function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
}); 

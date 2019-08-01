//http://jsoneditoronline.org/
//http://jsonmate.com/
//https://www.thomasfrank.se/downloadableJS/JSONeditor_example.html
//http://www.alkemis.com/johnsonRod/

/*
All resources has these common fields:
id, creatorId, ownerId, dateCreated, dateModified, deleted, dateDeleted, note

User		:(username, displayName, password, firstName, lastName, email, isSuspended)
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
"use strict";

const fs = require('fs');

//Generate Classes

//---------------------------------------------------
//                 User Class
//---------------------------------------------------
//(username, displayName, password, firstName, lastName, email, isSuspended)


var usernameField = {
		name:"username",
		type:"String",
		required:true,
		unique:true,
		validation:{
			min:4,
			max:16,
			regex:null,
			regexError:""
        }
	};

var displayNameField = {
		name:"displayName",
		type:"String",
		required:true,
		unique:false,
		validation:{
			min:4,
			max:16,
			regex:null,
			regexError:""
        }
	};

var pwField = {
		name:"password",
		type:"String",
		required:true,
		unique:false,
		validation:{
			min:6,
			max:16,
			regex:null,
			regexError:""
        }
	};

var firstnameField = {
		name:"firstName",
		type:"String",
		required:true,
		unique:false,
		validation:{
			min:4,
			max:16,
			regex:null,
			regexError:""
        }
	};

var lastnameField = {
		name:"lastName",
		type:"String",
		required:true,
		unique:false,
		validation:{
			min:4,
			max:16,
			regex:null,
			regexError:""
        }
	};
	
var emailField = {
		name:"email",
		type:"String",
		required:true,
		unique:false,
		validation:{
			min:6,
			max:32,
			regex:null,
			regexError:""
        }
	};
	
var isSuspendedField = {
		name:"isSuspended",
		type:"Bool",
		defaultValue:"false",
		required:false,
		unique:false,
		validation:{
			min:4,
			max:16,
			regex:null,
			regexError:""
        }
	};
	
var userClass = {name:"User", fields:[usernameField,displayNameField, pwField, firstnameField, lastnameField, emailField, isSuspendedField]};

//---------------------------------------------------
//                 Article Class
//---------------------------------------------------
//(title, bodyText, publishedDate, authorId, imageURL, note, isDraft, isModerated)

var titleField = {
		name:"title",
		type:"SmallText",
		required:true,
		unique:false,
		validation:{
			min:null,
			max:null,
			regex:null,
			regexError:""
        }
	};

var bodyTextField = {
		name:"bodyText",
		type:"Text",
		required:true,
		unique:false,
		validation:{
			min:null,
			max:null,
			regex:null,
			regexError:""
        }
	};

var publishedDateField = {
		name:"publishedDate",
		type:"Date",
		required:true,
		unique:false,
		validation:{
			min:null,
			max:null,
			regex:null,
			regexError:""
        }
	};

var authorField = {
		name:"author",
		type:"User",
		required:true,
		unique:false,
		validation:{
			min:null,
			max:null,
			regex:null,
			regexError:""
        }
	};
	
var imageURLField = {
		name:"imageURL",
		type:"String",
		required:false,
		unique:false,
		validation:{
			min:16,
			max:4096,
			regex:null,
			regexError:""
        }
	};

var editingNoteField = {
		name:"editingNote",
		type:"SmallText",
		required:false,
		unique:false,
		validation:{
			min:null,
			max:null,
			regex:null,
			regexError:""
        }
	};
	
var isDraftField = {
		name:"isDraft",
		type:"Bool",
		required:true,
		defaultValue: "true",
		unique:false,
		validation:{
			min:null,
			max:null,
			regex:null,
			regexError:""
        }
	};
	
var isModeratedField = {
		name:"isModerated",
		type:"Bool",
		required:true,
		defaultValue: "false",
		unique:false,
		validation:{
			min:null,
			max:null,
			regex:null,
			regexError:""
        }
	};

var articleClass = {name:"Article", fields:[titleField, bodyTextField, publishedDateField, authorField, imageURLField, editingNoteField, isDraftField, isModeratedField]};

//---------------------------------------------------
//                 Comment Class
//---------------------------------------------------
//(commentText, authorId, repliedTo, articleId)

var commentTextField = {
		name:"commentText",
		type:"SmallText",
		required:true,
		defaultValue: null,
		unique:false,
		validation:{
			min:null,
			max:null,
			regex:null,
			regexError:""
        }
	};
	
var authorField = {
		name:"author",
		type:"User",
		required:true,
		defaultValue: null,
		unique:false,
		validation:{
			min:null,
			max:null,
			regex:null,
			regexError:""
        }
	};

var repliedToField = {
		name:"repliedTo",
		type:"User",
		required:false,
		defaultValue: null,
		unique:false,
		validation:{
			min:null,
			max:null,
			regex:null,
			regexError:""
        }
	};
	
var articleField = {
		name:"article",
		type:"Article",
		required:true,
		defaultValue: null,
		unique:false,
		validation:{
			min:null,
			max:null,
			regex:null,
			regexError:""
        }
	};

var commentClass = {name:"Comment", fields:[commentTextField, authorField, repliedToField, articleField]}

//---------------------------------------------------
//                 Like Class
//---------------------------------------------------
//(userId, articleId)

var userField = {
		name:"user",
		type:"User",
		required:true,
		defaultValue: null,
		unique:true,
		validation:{
			min:null,
			max:null,
			regex:null,
			regexError:""
        }
	};
	
var articleField = {
		name:"article",
		type:"Article",
		required:true,
		defaultValue: null,
		unique:true,
		validation:{
			min:null,
			max:null,
			regex:null,
			regexError:""
        }
	};

var likeClass = {name:"Like", fields:[userField, articleField]};

//---------------------------------------------------
//                 Rate Class
//---------------------------------------------------
//(userId, articleId, value)

var userField = {
		name:"user",
		type:"User",
		required:true,
		defaultValue: null,
		unique:true,
		validation:{
			min:null,
			max:null,
			regex:null,
			regexError:""
        }
	};

var articleField = {
		name:"article",
		type:"Article",
		required:true,
		defaultValue: null,
		unique:true,
		validation:{
			min:null,
			max:null,
			regex:null,
			regexError:""
        }
	};
	
var valueField = {
		name:"value",
		type:"Int",
		required:true,
		defaultValue: null,
		unique:false,
		validation:{
			min:1,
			max:5,
			regex:null,
			regexError:""
        }
	};
	
var rateClass = {name:"Rate", fields:[userField, articleField, valueField]};

//---------------------------------------------------
//                 Tag Class
//---------------------------------------------------
//(tagText, articleId)

var tagTextField = {
		name:"tagText",
		type:"String",
		required:true,
		defaultValue: null,
		unique:true,
		validation:{
			min:3,
			max:32,
			regex:null,
			regexError:""
        }
	};
	
var articleField = {
		name:"article",
		type:"Article",
		required:true,
		defaultValue: null,
		unique:true,
		validation:{
			min:null,
			max:null,
			regex:null,
			regexError:""
        }
	};
	
var userField = {
		name:"user",
		type:"User",
		required:true,
		defaultValue: null,
		unique:false,
		validation:{
			min:null,
			max:null,
			regex:null,
			regexError:""
        }
	};

var tagClass = {name:"Tag", fields:[tagTextField, articleField, userField]};

//---------------------------------------------------
//                 Favourite Class
//---------------------------------------------------
//(userId, articleId)
var userField = {
		name:"user",
		type:"User",
		required:true,
		defaultValue: null,
		unique:true,
		validation:{
			min:null,
			max:null,
			regex:null,
			regexError:""
        }
	};
	
var articleField = {
		name:"article",
		type:"Article",
		required:true,
		defaultValue: null,
		unique:true,
		validation:{
			min:3,
			max:32,
			regex:null,
			regexError:""
        }
	};

var favouriteClass = {name:"Favourite", fields:[userField, articleField]};

//---------------------------------------------------
//                 Follower Class
//---------------------------------------------------
//(fellowerId, FelloweeId)
var fellowerField = {
		name:"theFollower",
		type:"User",
		required:true,
		defaultValue: null,
		unique:true,
		validation:{
			min:null,
			max:null,
			regex:null,
			regexError:""
        }
	};
	
var FelloweeField = {
		name:"theFellowee",
		type:"User",
		required:true,
		defaultValue: null,
		unique:true,
		validation:{
			min:null,
			max:null,
			regex:null,
			regexError:""
        }
	};

var followerClass = {name:"Follower", fields:[fellowerField, FelloweeField]};

//*************************************************************************
//*************************************************************************
//				Create Role Based Access Control Policies
//*************************************************************************
//*************************************************************************

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
var pg_articleReadPolicy = {action:"read", records:"any", fields:"id, title, bodyText, publishedDate, authorId, imageURL", limit:{amount:-1, rule:""}};
var pg_userReadPolicy = {action:"read",   records:"$resource.roleId!=1/i&$resource.roleId!=4/i", fields:"id, displayName", limit:{amount:-1, rule:""}};
var pg_userCreatePolicy = {action:"create",   records:"any", fields:"username, displayName, password, firstName, lastName, email", limit:{amount:-1, rule:""}};
var pg_commentReadPolicy = {action:"read",   records:"any", fields:"id, commentText, authorId, repliedTo", limit:{amount:-1, rule:""}};
var pg_likeReadPolicy = {action:"read",   records:"any", fields:"id, userId, articleId", limit:{amount:-1, rule:""}};
var pg_tagReadPolicy = {action:"read",   records:"any", fields:"id, tagText, articleId", limit:{amount:-1, rule:""}};
var pg_followerReadPolicy = {action:"read",   records:"any", fields:"id, fellowerId, FelloweeId", limit:{amount:-1, rule:""}};	

//PublicGuest resources
var pg_article = {resource:"Article", policies:[pg_articleReadPolicy]};
var pg_user = {resource:"User", policies:[pg_userCreatePolicy, pg_userReadPolicy]};
var pg_comment = {resource:"Comment", policies:[pg_commentReadPolicy]};
var pg_like = {resource:"Like", policies:[pg_likeReadPolicy]};
var pg_tag = {resource:"Tag", policies:[pg_tagReadPolicy]};
var pg_follower = {resource:"Follower", policies:[pg_followerReadPolicy]};

//PublicGuest role
var pg_role = {role:"PublicGuest", inherits:"", grant:[pg_article, pg_user, pg_comment, pg_like, pg_tag, pg_follower]}; 


//---------------------------------------------------
//              Moderator   
//---------------------------------------------------
// Moderator Policies
var mod_createArticle = {action:"create", records:"any", fields:"*", limit:{amount:-1, rule:""}};
var mod_updateArticle = {action:"update", records:"any", fields:"*", limit:{amount:-1, rule:""}};
var mod_deleteArticle = {action:"delete", records:"any", fields:"*", limit:{amount:-1, rule:""}};
var mod_readArticle = {action:"read", records:"any", fields:"*", limit:{amount:-1, rule:""}};

var mod_createComment = {action:"create", records:"any", fields:"*", limit:{amount:-1, rule:""}};
var mod_updateComment = {action:"update", records:"any", fields:"*", limit:{amount:-1, rule:""}};
var mod_deleteComment = {action:"delete", records:"any", fields:"*", limit:{amount:-1, rule:""}};
var mod_readComment = {action:"read", records:"any", fields:"*", limit:{amount:-1, rule:""}};

var mod_updateUser = {action:"update", records:"any", fields:"username, displayName, firstName, lastName, email, isSuspended", limit:{amount:-1, rule:""}};
var mod_deleteUser = {action:"delete", records:"any", fields:"*", limit:{amount:-1, rule:""}};
var mod_readAdminUser = {action:"read", records:"$resource.roleId=1/i", fields:"id, displayName, email", limit:{amount:-1, rule:""}};
var mod_readUser = {action:"read", records:"$resource.roleId!=1/i", fields:"*, !password", limit:{amount:-1, rule:""}};

// Moderator resources
var mod_article = {resource:"Article", policies:[mod_createArticle,mod_updateArticle,mod_deleteArticle,mod_readArticle]};
var mod_user = {resource:"User", policies:[mod_updateUser,mod_deleteUser,mod_readAdminUser, mod_readUser]};
var mod_comment = {resource:"Comment", policies:[mod_createComment,mod_updateComment,mod_deleteComment,mod_readComment]};

// Moderator role
var mod_role = {role:"Moderator", inherits:"", grant:[mod_article, mod_user, mod_comment]}; 

//---------------------------------------------------
//                 Author
//---------------------------------------------------
//Author Policies
var auth_readOwnUser = {action:"read", records:"$resource.roleId=$user.id", fields:"id, username, displayName, password, firstName, lastName, email", limit:{amount:-1, rule:""}};
var auth_readUser = {action:"read", records:"$resource.roleId!=1/i", fields:"id, displayName, firstName, lastName, email", limit:{amount:-1, rule:""}};
var auth_updateUser = {action:"update", records:"$resource.id=$user.id", fields:"username, displayName, password, firstName, lastName, email", limit:{amount:-1, rule:""}};
var auth_deleteUser = {action:"delete", records:"$resource.id=$user.id", fields:"*", limit:{amount:-1, rule:""}};

var auth_createArticle 	  =	{action:"create", records:"any", fields:"*", limit:{amount:-1, rule:""}};
var auth_updateArticle    =	{action:"update", records:"$resource.authorId=$user.id", fields:"title, bodyText, publishedDate, authorId, imageURL, editingNote", limit:{amount:-1, rule:""}};
var auth_deleteArticle    =	{action:"delete", records:"$resource.authorId=$user.id", fields:"*", limit:{amount:-1, rule:""}};
var auth_readOwnArticle   =	{action:"read", records:"$resource.authorId=$user.id", fields:"id, title, bodyText, publishedDate, authorId, imageURL, editingNote, isDraft, isModerated", limit:{amount:-1, rule:""}};
var auth_readOtherArticle = {action:"read", records:"$resource.authorId!=$user.id", fields:"id, title, bodyText, publishedDate, authorId, imageURL", limit:{amount:-1, rule:""}};

var auth_createLike = {action:"create", records:"any", fields:"*", limit:{amount:-1, rule:""}};
var auth_deleteLike = {action:"delete", records:"$resource.userId =$user.id", fields:"*", limit:{amount:-1, rule:""}};
var auth_getLike = {action:"read", records:"any", fields:"id, userId, articleId", limit:{amount:-1, rule:""}};

var auth_createComment = {action:"create", records:"any", fields:"*", limit:{amount:-1, rule:""}};
var auth_updateComment = {action:"update", records:"resource.authorId=$user.id", fields:"commentText, authorId, repliedTo, articleId", limit:{amount:-1, rule:""}};
var auth_readComment = {action:"read", records:"any", fields:"id, commentText, authorId, repliedTo, articleId", limit:{amount:-1, rule:""}};
var auth_deleteComment = {action:"delete", records:"resource.authorId=$user.id", fields:"*", limit:{amount:-1, rule:""}};

var auth_createFavourite = {action:"create", records:"any", fields:"*", limit:{amount:-1, rule:""}};
var auth_deleteFavourite = {action:"delete", records:"$resource.userId=$user.id", fields:"*", limit:{amount:-1, rule:""}};
var auth_readFavourite = {action:"read", records:"$resource.userId=$user.id", fields:"id, userId, articleId", limit:{amount:-1, rule:""}};

var auth_createFollower = {action:"create", records:"any", fields:"*", limit:{amount:-1, rule:""}};
var auth_deleteFollower = {action:"delete", records:"$resource.followerId=$user.id", fields:"*", limit:{amount:-1, rule:""}};
var auth_readFollower = {action:"read", records:"any", fields:"id, fellowerId, FelloweeId", limit:{amount:-1, rule:""}};

var auth_createTag = {action:"create", records:"SELECT * FROM Article WHERE Article.Id=$resource.articleId AND Article.authorId=$user.id", fields:"*", limit:{amount:-1, rule:""}};
var auth_updateTag = {action:"update", records:"SELECT * FROM Article WHERE Article.Id=$resource.articleId AND Article.authorId=$user.id", fields:"tagText, articleId, userId", limit:{amount:-1, rule:""}};
var auth_deleteTag = {action:"delete", records:"SELECT * FROM Article WHERE Article.Id=$resource.articleId AND Article.authorId=$user.id", fields:"*", limit:{amount:-1, rule:""}};
var auth_readTag = {action:"read", records:"any", fields:"id, tagText, articleId, userId", limit:{amount:-1, rule:""}};

var auth_readRate ={action:"read", records:"any", fields:"id, userId, articleId, value", limit:{amount:-1, rule:""}};
	
//Author resources
var auth_user = {resource:"User", policies:[auth_readOwnUser, auth_readUser, auth_updateUser, auth_deleteUser]};
var auth_article = {resource:"Article", policies:[auth_createArticle, auth_updateArticle, auth_deleteArticle, auth_readOwnArticle, auth_readOtherArticle]};
var auth_like = {resource:"Like", policies:[auth_createLike,auth_deleteLike,auth_getLike]};
var auth_comment = {resource:"Comment", policies:[auth_createComment,auth_updateComment,auth_readComment,auth_deleteComment]};
var auth_favourite = {resource:"Favourite", policies:[auth_createFavourite,auth_deleteFavourite,auth_readFavourite]};
var auth_follower = {resource:"Follower", policies:[auth_createFollower,auth_deleteFollower,auth_readFollower]};
var auth_tag = {resource:"Tag", policies:[auth_createTag,auth_updateTag,auth_deleteTag,auth_readTag]};
var auth_Rate = {resource:"Rate", policies:[auth_readRate]};

//Author role
var auth_role = {role:"Author", inherits:"", grant:[auth_user, auth_article,auth_like,auth_comment,auth_favourite,auth_follower,auth_tag, auth_Rate]}; 

//---------------------------------------------------
//                 PaidAuthor
//---------------------------------------------------
//PaidAuthor policies
var pauth_createRate ={action:"create", records:"SELECT * FROM Article WHERE Article.authorId!=$user.id", fields:"*", limit:{amount:-1, rule:""}};
var pauth_deleteRate ={action:"delete", records:"SELECT * FROM Article WHERE Article.Id=$resource.articleId AND Article.Id=$user.id", fields:"*", limit:{amount:-1, rule:""}};

var pauth_createTag ={action:"create", records:"any", fields:"*", limit:{amount:-1, rule:""}};
var pauth_updateTag = {action:"update", records:"$resource.userId=$user.id", fields:"*", limit:{amount:-1, rule:""}};
var pauth_deleteTag ={action:"delete", records:"$resource.userId=$user.id", fields:"*", limit:{amount:-1, rule:""}};


var pauth_deleteComment ={action:"delete", records:"SELECT * FROM Article WHERE Article.authorId=$user.id", fields:"*", limit:{amount:-1, rule:""}};


//PaidAuthor resources

var pauth_rate = {resource:"Rate", policies:[pauth_createRate,pauth_deleteRate]};
var pauth_comment = {resource:"Comment", policies:[pauth_deleteComment]};
var pauth_tag = {resource:"Tag", policies:[pauth_createTag,pauth_updateTag,pauth_deleteTag]};

//PaidAuthor role

var pauth_role = {role:"PaidAuthor", inherits:"Author", grant:[pauth_rate,pauth_comment,pauth_tag]}; 

//---------------------------------------------------
//                 RBAC Schema
//---------------------------------------------------
var schema = {accesscontrol:[admin_role, pg_role,auth_role,mod_role,pauth_role]};


//---------------------------------------------------
//                 Final Etqan JSON
//---------------------------------------------------

var finalJson = {
		ApiPackage:"net.talaween.oktob",
		projectName:"Oktob API",
		apiVersion:"v0.6",
		generateMockData:true,
		settings: {
		   superAdminUsername : "mahmoud",
		   superAdminPassword:"",
		   defaultRole: "Author"
		},
		classes:[userClass, articleClass, commentClass, likeClass, rateClass,
			tagClass, favouriteClass, followerClass],
		Schema: schema
	};

fs.writeFile("oktob_rbac.json", JSON.stringify(finalJson), function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
}); 

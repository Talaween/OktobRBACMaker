//http://jsoneditoronline.org/
//http://jsonmate.com/
//https://www.thomasfrank.se/downloadableJS/JSONeditor_example.html
//http://www.alkemis.com/johnsonRod/

const fs = require('fs');

//admin policies
var pa_readAny   = {action:"read",   records:"any", fields:"*", limit:{amount:-1, rule:""}};
var pa_createAny = {action:"create", records:"any", fields:"*", limit:{amount:-1, rule:""}};
var pa_updateAny = {action:"update", records:"any", fields:"*", limit:{amount:-1, rule:""}};
var pa_deleteAny = {action:"delete", records:"any", fields:"*", limit:{amount:-1, rule:""}};

//admin resources
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

//admin role		
var admin_role = {role:"Admin", inherits:"", grant:[
		admin_article, admin_comment, admin_user, admin_like, admin_rate,
		admin_tag, admin_favourite, admin_follower]};  
		
//---------------------------------------------------
//publicGuest Policies
var pg_articleReadPolicy = {action:"read", records:"any", fields:"title, bodyText, publishedDate, authorId, imageURL", limit:{amount:-1, rule:""}};
var pg_userReadPolicy = {action:"read",   records:"$resource.roleId != 1&$resource.roleId != 3", fields:"displayName", limit:{amount:-1, rule:""}};
	
//publicGuest resources
var pg_article = {resource:"Article", policies:[pg_articleReadPolicy]};
var pg_user = {resource:"User", policies:[pg_userReadPolicy]};

//publicGuest role
var pg_role = {role:"PublicGuest", inherits:"", grant:[pg_article, pg_user ]};  

//------------------------------
//final schema
var schema = {accesscontrol:[admin_role, pg_role]};

fs.writeFile("oktob_rbac.json", JSON.stringify(schema), function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
}); 

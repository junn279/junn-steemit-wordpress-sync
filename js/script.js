function compare(a,b) 
{
	if (a.created > b.created)
		return -1;
	if (a.created < b.created)
		return 1;
	return 0;
}
function changeBrTag( html ) {
        return html.replace(/(\r\n\|\r|\n)/gi, "\<br\/\>");
}
function changeYouTubeTag( html ) {
        return html.replace(/https:\/\/youtu.be\/([\w]*)/gi, '\<p\>\<iframe wdith="420" height="315" src="https:\/\/www.youtube.com\/embed\/$1"\>\<\/iframe\>\<\/p\>');
}
function imageSetting(html)
{
	var html_change = html;
	var regex = /(<([^>]+)>)/ig
	var result = html_change.replace(regex, "");
	
	regex = /(https?:\/\/.*\.(?:png|jpg|jpeg))/ig;
	var arrMatch = result.match(regex);
	//console.log(arrMatch);
	if(arrMatch != null)
	{
		for(var i=0;i<arrMatch.length;i++)
		{
			re = new RegExp(arrMatch[i], "g");
			html_change = html_change.replace(re,"<img src='"+arrMatch[i]+"'/>");	
			if(i!=arrMatch.lenght-1)
			{
				for(var j=i+1;j<arrMatch.length;j++)
				{
					if(arrMatch[j]==arrMatch[i])
					{
	        			arrMatch.splice(j,1);
	    			}
	    		}
			}
		}
	}
	return html_change;
}
function getFirstImage(obj)
{
	if(obj.hasOwnProperty("json_metadata") == false || obj.json_metadata.length == 0)
	{
		src = args.null_image_url;
	}
	else
	{
		/*{"tags":["kr","kr-med","mediteam","scuba","diving"],"image":["https://junn.in/wp-content/uploads/2017/09/Ear-Picture.jpg","https://junn.in/wp-content/uploads/2017/09/ET_Normal-300x142.jpg","https://junn.in/wp-content/uploads/2017/09/equalizing-300x154.png","https://junn.in/wp-content/uploads/2017/09/screen.png","https://junn.in/wp-content/uploads/2017/09/normal_state-300x200.png","https://junn.in/wp-content/uploads/2017/09/press2-216x300.png","https://junn.in/wp-content/uploads/2017/09/val.png","https://junn.in/wp-content/uploads/2017/09/inflam.png","https://junn.in/wp-content/uploads/2017/09/inflam2.png","https://junn.in/wp-content/uploads/2017/09/OME_AOM_01-300x298.jpg"],"links":["https://www.drsethi.com.sg/eustachian-tube-dysfuction/"],"app":"steemit/0.1","format":"html"}*/
		var articleMeta = JSON.parse(obj.json_metadata);
		//console.log(i,authorMeta,authorMeta.hasOwnProperty("image"));
		//article.hasOwnProperty("json_metadata")
		if(articleMeta.hasOwnProperty("image") == true && articleMeta.image.length > 0)
		{
			src = articleMeta.image[0];
		}
		else
		{
			src = args.null_image_url;
		}
	   	//$('#wrapper #main .meta .author img').attr('style','width:100%;max-width:846px; height:auto;');
	}
	return src;
}
function getTags(obj)
{
	if(obj.hasOwnProperty("json_metadata") == false || obj.json_metadata.length == 0)
	{
		return null;
	}
	else
	{
		/*{"tags":["kr","kr-med","mediteam","scuba","diving"],"image":["https://junn.in/wp-content/uploads/2017/09/Ear-Picture.jpg","https://junn.in/wp-content/uploads/2017/09/ET_Normal-300x142.jpg","https://junn.in/wp-content/uploads/2017/09/equalizing-300x154.png","https://junn.in/wp-content/uploads/2017/09/screen.png","https://junn.in/wp-content/uploads/2017/09/normal_state-300x200.png","https://junn.in/wp-content/uploads/2017/09/press2-216x300.png","https://junn.in/wp-content/uploads/2017/09/val.png","https://junn.in/wp-content/uploads/2017/09/inflam.png","https://junn.in/wp-content/uploads/2017/09/inflam2.png","https://junn.in/wp-content/uploads/2017/09/OME_AOM_01-300x298.jpg"],"links":["https://www.drsethi.com.sg/eustachian-tube-dysfuction/"],"app":"steemit/0.1","format":"html"}*/
		var articleMeta = JSON.parse(obj.json_metadata);
		//console.log(i,authorMeta,authorMeta.hasOwnProperty("image"));
		//article.hasOwnProperty("json_metadata")
		if(articleMeta.hasOwnProperty("tags") == true && articleMeta.tags.length > 0)
		{
			return articleMeta.tags;
		}
	}
	return null;
}

/*
주의 사항 last_update 가 수정여부를 평가하는 기준이 되어야 한다.
*/
jQuery(document).ready(function($) 
{
	//alert(args.template_permlink);
	var url =  args.giphy_url;
	var msg = args.target_id + '이 작성한 글을 확인 중 입니다.<br><img style="width:50px;height:50px;" src="' + url + '"/>';
	jQuery("#"+args.status_view).html(msg);
	//jQuery("#"+args.status_view).notify(args.target_id, "success",{ position:"bottom" });
	console.log("..sync..");
	var today = new Date();
	today.setMinutes(today.getMinutes()-today.getTimezoneOffset());
	var today_str = today.format('yyyy-mm-dd') + 'T' + today.format('HH:MM:ss');

	/*steem.api.getAccounts(['doctorfriend'], function(err, accounts)
	{
		console.log(err,accounts);
	});*/
	//console.log(args.target_id,today_str);
	steem.api.getDiscussionsByAuthorBeforeDate(args.target_id,
		'',today_str,100, 
		function(err, result) {
    	console.log(err, result);
    	var content_arr = new Array();
	    //console.log("contents", content_obj);
	 	for(var i=0;i<result.length;i++)
    	{
    		content_arr[content_arr.length] = result[i];
    	}
	 	content_arr.sort(compare);//Sorting
	 	var converter = new showdown.Converter();
	 	var json_arr = new Array();
	 	for(var i=0;i<content_arr.length;i++)
	 	{
 			var article = content_arr[i];
 			var author = article.author;
 			var body = article.body;
 			body = converter.makeHtml(body);
 			body = changeYouTubeTag(changeBrTag(imageSetting(body)));
 			var json_meta = article.json_metadata;//JSON
 			var last_update = article.last_update;
 			var created_at = article.created;
 			var permlink = article.permlink;
 			var title = article.title;
 			var steem_url = article.url;
	 		var json_element = new Object();
			json_element.author = author;
	 		json_element.body = body;
	 		json_element.json_meta = json_meta;
	 		json_element.last_update = last_update;
	 		json_element.created_at = created_at;
	 		json_element.permlink = permlink;
	 		json_element.title = title;
	 		json_element.steem_url = steem_url;
	 		json_element.first_image = getFirstImage(article);
	 		json_element.tags = getTags(article);
	 		
	 		json_arr[json_arr.length] = json_element;
	 	}
	 	var post_json = JSON.parse(JSON.stringify(json_arr));	//Object to JSON : OK
	 	console.log("POST",post_json);
	 	
	 	$.ajax({
	 		url:args.template_permlink,
	 		type:'post',
	 		dataType:'json',
	 		data:{"json_data":post_json},
	 		error : function(error) {
    		    //alert("Error!");
    		    console.log(error);
    		    console.log("error");
    		},
	 		success: function(data){      
      					console.log(data);
			            if(data['result'] == 'success')
			            {
			             	var insert_count = data['insert_count'];
			             	var insert_error = data['insert_error_count'];
			             	var update_count = data['update_count'];
			             	var update_error = data['update_error_count'];
			             	$("#"+args.status_view).html("<p>등록 : "+insert_count+
			             		"</p><p>오류 : "+insert_error+"</p><p>업데이트 : "
			             		+update_count+"</p><p>오류 : "+update_error+"</p>");
			            }
			            else
			            {
			             	$("#"+args.status_view).html("<p>FAIL</p>");	
			            }
      		},
      		complete : function() {
        		//alert("complete!");   //종결된 후 
        		console.log("complete");
   			 }
      	});
	});
	

	/*$.post("https://yjnjg.net/sync", { "cmd": "add2" },    
      function(data){      
      	console.log("result");
             console.log(data['result']); // John         
             if(data['result'] == 'success')
             {
             	$("#jslp_sync_view").html("<p>OK</p>");
             }
             else
             {
             	$("#jslp_sync_view").html("<p>FAIL</p>");	
             }
      }, "json");*/
});
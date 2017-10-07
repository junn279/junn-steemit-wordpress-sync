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

/*
주의 사항 last_update 가 수정여부를 평가하는 기준이 되어야 한다.
*/
jQuery(document).ready(function($) 
{
	console.log("..sync..");
	var today = new Date();
	today.setMinutes(today.getMinutes()-today.getTimezoneOffset());
	var today_str = today.format('yyyy-mm-dd') + 'T' + today.format('HH:MM:ss');

	steem.api.getAccounts(['doctorfriend'], function(err, accounts)
	{
		console.log(err,accounts);
	});
	
	steem.api.getDiscussionsByAuthorBeforeDate("doctorfriend",
		'',today_str,100, 
		function(err, result) {
    	//console.log(err, result);
    	var content_arr = new Array();
	    //console.log("contents", content_obj);
	 	for(var i=0;i<result.length;i++)
    	{
    		content_arr[content_arr.length] = result[i];
    	}
	 	//console.log("contents_arr", content_arr);
	 	content_arr.sort(compare);
	 	console.log(content_arr);
	 	var converter = new showdown.Converter();
    	/*text = result.body,
    	html_body = converter.makeHtml(text);
    	html_body = changeYouTubeTag(changeBrTag(imageSetting(html_body)));*/

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
	 		
	 		json_arr[json_arr.length] = json_element;
	 	}
	 	var post_json = JSON.parse(JSON.stringify(json_arr));	//Object to JSON : OK
	 	//console.log(post_json[0]);

	 	/*$.ajax({
	 		url:"https://yjnjg.net/sync",
	 		type:'post',
	 		dataType:'json',
	 		data:{"json_data":post_json,
	 		"cmd": "add2"},
	 		success:
	    			function(data){      
      					console.log("result");
      					console.log(data['code']);
             			console.log("A",data['title']); // John     
             			console.log("B1",data['time']); // John  
             			console.log("B2",data['time2']); // John  
             			console.log("B3",data['time3']); // John  
             			console.log("C",data['author']);
             			console.log("D",data['return']); 
             			console.log("e",data['error_msg']);      
			             if(data['result'] == 'success')
			             {
			             	var count = data['insert_count'];
			             	$("#jslp_sync_view").html("<p>"+count+"</p>");
			             }
			             else
			             {
			             	$("#jslp_sync_view").html("<p>FAIL</p>");	
			             }
      				}
      	});*/
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
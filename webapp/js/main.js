$(document).ready(function() {
	/* Ajax setup */
	$.ajaxSetup({
		cache : true
	});
	window.fbAsyncInit = function() {
		/* initialize the library with the API key */
		FB.init({
			appId 		: '934200506718441', 						 			/* Application ID from the app dashboard */
			channelUrl 	: 'http://deolhonofacebook.appspot.com/channel.html', 	/* Channel file for x-domain comms */
			status 		: true, 												/* Check Facebook Login status */
			xfbml 		: true, 												/* Look for social plugins on the page */
			cookie 		: true
		});
		
		/* 
		 * Here we subscribe to the auth.authResponseChange JavaScript event. This event is fired
		 * for any authentication related change, such as login, logout or session refresh. This means that
		 * whenever someone who was previously logged out tries to log in again, the correct case below
		 * will be handled.
		 * */ 
		FB.Event.subscribe('auth.authResponseChange', function(response) {
			/* Here we specify what we do with the response anytime this event occurs. */ 
			if (response.status === 'connected') {
				/* 
				 * The response object is returned with a status field that lets the app know the current
				 * login status of the person. In this case, we're handling the situation where they
				 * have logged in to the app.
				   
				   var path = 'https://www.facebook.com/dialog/oauth?';
			       var queryParams = ['client_id=' + '476917739063173',
			         'redirect_uri=' + window.location,
			         'response_type=token',
			         'scope=offline_access'];
			       var query = queryParams.join('&');
			       var url = path + query;
			       window.open(url);
			       
				 * */
				
				if(document.URL.match("/facebook")){
					console.log("Index page");
				}else if(document.URL.match("feed")){
					console.log("Feed page");
					
					var access_token =   FB.getAuthResponse()['accessToken'];
					var url = 'https://graph.facebook.com/me?fields=home.limit(50).fields(id,message,created_time,from,type)&access_token=' + access_token;
					/* load table */
					loadTable(url);
					
				}else if(document.URL.match("about")){
					console.log("About page");
				}else if(document.URL.match("contact")){
					console.log("Contact page");
				}else if(document.URL.match("apps")){
					console.log("Apps page");
				}else if(document.URL.match("friends")){
					console.log("Friends page");
				}else{
					$('#indexContent').addClass('invisible');
					redirect();
				}
			} else if (response.status === 'not_authorized') {
				/* 
				 * In this case, the person is logged into Facebook, but not into the app, so we call
				 * FB.login() to prompt them to do so.
				 * In real-life usage, you wouldn't want to immediately prompt someone to login
				 * like this, for two reasons:
				 * 
				 * (1) JavaScript created popup windows are blocked by most browsers unless they
				 * result from direct interaction from people using the app (such as a mouse click)
				 * (2) it is a bad experience to be continually prompted to login upon page load.
				 * */
				//FB.login();
				window.location.href = "/";
				$('#indexContent').removeClass('invisible');
			} else {
				/*
				 * In this case, the person is not logged into Facebook, so we call the login()
				 * function to prompt them to do so. Note that at this stage there is no indication
				 * of whether they are logged into the app. If they aren't then they'll see the Login
				 * dialog right after they log in to Facebook.
				 * 
				 *  The same caveats as above apply to the FB.login() call here.
				 *  FB.login(function(response) {
				 *  // handle the response
				 *  }, {scope: 'publish_actions'});
				 *  
				 * */  
				//FB.login();
				window.location.href = "/";
				$('#indexContent').removeClass('invisible');
			}
		});
		
	};
	

	// Load the SDK asynchronously
	(function(d, s, id) {
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) {
			return;
		}
		js = d.createElement(s);
		js.id = id;
		js.src = "//connect.facebook.net/en_US/all.js";
		fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));
	
	
	/* 
	 * Here we run a very simple test of the Graph API after login is successful.
	 * This testAPI() function is only called in those cases. 
	 * */ 
	  function redirect() {
	    console.log('Welcome!  Fetching your information.... ');
	    FB.api('/me', function(response) {
	    	console.log('Good to see you, ' + response.name + '.');
	    });
	    window.location.href = "/facebook";
	  }
	  
	$("#prevLink").on("click", function(event){
		event.preventDefault();
		var url = $('#prevLink').attr("href");
		/* load table */
		loadTable(url, true);
		
		if(parseInt($('#dataPage').attr('data-page')) > 1){
			var page = parseInt($('#dataPage').attr('data-page')) - 1;
			$('#dataPage').attr("data-page", page);
		}
	});
	
	$("#nextLink").on("click", function(event){
		event.preventDefault();
		var url = $('#nextLink').attr("href");
		/* load table */
		loadTable(url, true);
		
		var page = parseInt($('#dataPage').attr('data-page')) + 1;
		$('#dataPage').attr("data-page", page);
	});
	
	if(parseInt($('#dataPage').attr('data-page')) == 1){
		$('#prevLi').attr("class", "disabled");
	}else{
		$('#prevLi').attr("class", "");
	}
});

$(document).ajaxComplete(function(){
    try{
        setTimeout(FB.XFBML.parse);
    }catch(ex){
    	
    }
});

/**
 * Truncate String
 * */
function truncateString(message, length){
	if(message != null){
		return message.substring(0, length) + '...';
	}else{
		return "No has text..."
	}
}
/**
 * Format date
 * */
function formatDate(created_time){
	var myDate = new Date(created_time);
	var date = '';
	date += myDate.getDate() + '/' + myDate.getMonth() + '/' + myDate.getFullYear() + ' &agrave;s '; 
	date += myDate.getHours() + ':' + myDate.getMinutes() + ':' + myDate.getSeconds();
	//console.log(date);
	return date;
}

/**
 * Load post data in table
 * */
function loadTable(url, isPaging){
	$.getJSON(url, function(data) {
		console.log(url);
		console.log(data);
		var obj;
		
		if(isPaging){
			/* Pagination links */
			$('#prevLink').attr("href", data.paging.previous);
			$('#nextLink').attr("href", data.paging.next);
			obj = data.data;
		}else{
			/* Pagination links */
			$('#prevLink').attr("href", data.home.paging.previous);
			$('#nextLink').attr("href", data.home.paging.next);
			obj = data.home.data;
		}
        
        /* clean table content */
        $('#table_content').html('');
        Object.keys(obj).forEach(function(key){
        	
        	var uniqueID = obj[key].id;
        	var userID = uniqueID.split("_")[0]
        	var postID = uniqueID.split("_")[1];
        	
        	/* Create post data */
        	var data = {
        			id: (parseInt(key) + 1) + (parseInt($('#dataPage').attr('data-page')) - 1) * 10,
        			message: truncateString(obj[key].message, 45),
        			from: obj[key].from.name,
        			type: obj[key].type,
        			created_time: formatDate(obj[key].created_time),
        			link: 'http://facebook.com/' + userID + '/posts/' + postID
        	};
        	
        	// load the template file, then render it with data
        	var contentLine = new EJS({url: 'pages/templates/table_line.ejs'}).render(data);
        	$('#table_content').append(contentLine);
        });
	 });
}
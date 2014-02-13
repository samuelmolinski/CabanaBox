 	 var globalUserID;

 	  //http://developers.facebook.com/docs/reference/javascript/FB.ui/	
      window.fbAsyncInit = function() {
        // init the FB JS SDK
        FB.init({
          appId      : '230306400329884', // App ID from the App Dashboard
		  //appId      : '448305385283158', //dummy app for Pablo CPU
          channelUrl : '//indicedenovosvalores.com.br/CompartilheValores/channel.html', // Channel File for x-domain communication
          status     : true, // check the login status upon init?
          cookie     : true, // set sessions cookies to allow your server to access the session?
          xfbml      : true,  // parse XFBML tags on this page?    
          oauth      : true
        });
		FB.Canvas.setSize({ width: 810, height: 1150 });
    
        // Additional initialization code such as adding Event Listeners goes here
    
      };
    	
    	//O cliente deve adicionar o app na fanpage com o link abaixo
		//https://www.facebook.com/dialog/pagetab?app_id=218922784940536&display=popup&redirect_uri=http://www.indicedenovosvalores.com.br/CompartilheValores/
		//
      // Load the SDK's source Asynchronously
      // Note that the debug version is being actively developed and might 
      // contain some type checks that are overly strict. 
      // Please report such bugs using the bugs tool.
      (function(d, debug){
         var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
         if (d.getElementById(id)) {return;}
         js = d.createElement('script'); js.id = id; js.async = true;
         js.src = "//connect.facebook.net/pt_BR/all" + (debug ? "/debug" : "") + ".js";
         ref.parentNode.insertBefore(js, ref);
       }(document, /*debug*/ false));
	   
	//////////////
	//custom
	////////////
	//
	function logouSucesso(success, postID, userID, message){
	    loader.remove();
		if(success){
			TweenMax.to(jQuery("#principal"), .35, { autoAlpha:0});
			TweenMax.to(jQuery("#montaValores"), .35, { autoAlpha:1});
		}else{
			alert(message);
		}
	}
	function afterPublishedLogo(success, postID, userID, message){
		//_gaq.push(['_trackEvent', 'publicouFoto', 'userID_'+userID, 'postID_'+postID]);
		document.getElementById("enviando").style.display = "none";
		if(success){
			alert("success: " + success + "\n postID: " + postID + "\n userID: " + userID);
		//_gaq.push(['_trackEvent', 'compartilhouLogoComSucesso', userID]);
		}else{
			alert(message);
		}
	}
	function publishImageOnFB(imageURL, message, listenerFunction){
		//_gaq.push(['_trackEvent', 'clique_compartilhar_logo', imageURL]);
		document.getElementById("enviando").style.display = "block";
		FacebookStuff.publishImageToWall(imageURL, message, listenerFunction);
	}
	function publishImageOnFBWithName(imageURL, message, listenerFunction){	
		//_gaq.push(['_trackEvent', 'clique_compartilhar_checkin', imageURL]);
		document.getElementById("enviando").style.display = "block";
		FacebookStuff.publishImageToWallWithUserName(imageURL, message, listenerFunction);
	}
	function publishFeedOnFB(message, listenerFunction){		
		//document.getElementById("enviando").style.display = "block";
		FacebookStuff.publishFeedToWall(message, listenerFunction);
	}
	//
	function sendRequestViaMultiFriendSelector() {
		//_gaq.push(['_trackEvent', 'clique_convidar', 'vai_convidar_amigos']);
		FB.ui({
		method:   'apprequests',
		title:    'Indique #CompartilheValores',
		message: 'Para mostrar a todo mundo qual o valor que você quer compartilhar..',
		data:    'convidadoPeloApp',
		new_style_message: true
		}, requestCallback);
	}

	function requestCallback(response) {
		document.getElementById("enviando").style.display = "none";
		if(response){
			//console.log(response);
			alert('Seu amigos foram convidados para conhecer o #CompartilheValores.');
			//_gaq.push(['_trackEvent', 'clique_convidar', 'convidou_amigos']);
		}
	}

	////
	function afterPublished(success, postID, userID, message){
		document.getElementById("enviando").style.display = "none";
		if(success){
			alert("success: " + success + "\n postID: " + postID + "\n userID: " + userID);
			//_gaq.push(['_trackEvent', 'publicouFoto', 'userID_'+userID, 'postID_'+postID]);
		}else{
			alert(message);
		}
	}
	function afterPublishedLogo(success, postID, userID, message){
		//_gaq.push(['_trackEvent', 'publicouFoto', 'userID_'+userID, 'postID_'+postID]);
		document.getElementById("enviando").style.display = "none";
		if(success){
			alert("success: " + success + "\n postID: " + postID + "\n userID: " + userID);
		//_gaq.push(['_trackEvent', 'compartilhouLogoComSucesso', userID]);
		}else{
			alert(message);
		}
	}

	function criaPhotos( photos, id ){

		return [ '<li><img id="img'+id+'" src="'+photos["src"]+'" rel="'+photos["src_big"]+'"></li>' ].join('');	
	}


	/////////
	var FacebookStuff = (function() {
	//private

	var queryAndPrepareToPostFeed = function (userID, accessToken, message, listenerFunction){
		var uid = userID;
		var access_token = accessToken;
		
		//check And Publish	   		
		FB.api({
			method: 'fql.query',
			query: 'select publish_stream from permissions where uid=me()'
		},function(response) {
			if (response) {					
				if(response[0].publish_stream == "1"){
					PostFeedToFacebook(uid, access_token, "imagem", "image/jpeg", message, listenerFunction );
				}
				else{
					showErrorOrSuccess("Desculpe, mas você precisa completar o processo de autorização.", listenerFunction);
					FB.logout(function(response) {
					  //window.location.reload();
					  setTimeout(top.location.href = "./resolveAuth.html", 1000);
					});
							
			};				
		   }else{
			   showErrorOrSuccess("A publicação falhou. Por favor tente novamente.", listenerFunction);
		   };
			
		});
		/////////
	}
	/////
	var queryAndPrepareToPostImage = function (userID, accessToken, imageToPublish, message, listenerFunction){
		var uid = userID;
		var access_token = accessToken;
		
		//check And Publish	   		
		FB.api( {
			method: 'fql.query',
			query: 'select publish_stream,user_photos from permissions where uid=me()'
		},function(response) {
			if (response) {					
				if(response[0].publish_stream == "1" && response[0].user_photos=="1"){
					PostImageToFacebook(uid, access_token, "imagem", "image/jpeg", imageToPublish, message, listenerFunction );
				}
				else{
					showErrorOrSuccess("Desculpe, mas você precisa completar o processo de autorização.", listenerFunction);
					FB.logout(function(response) {
					  //window.location.reload();
					  setTimeout(top.location.href = "./resolveAuth.html", 1000);
					});
							
			}				
		   }else{
			   showErrorOrSuccess("A publicação falhou. Por favor tente novamente.", listenerFunction);
		   };
			
		});
		/////////
	}
	//
	var queryAuths = function (userID, listenerFunction){
		var uid = userID;
		globalUserID = userID;
		
		//check And Publish	   		
		FB.api( {
			method: 'fql.query',
			query: 'select publish_stream,user_photos from permissions where uid=me()'
		},function(response) {
			if (response) {					
				if(response[0].publish_stream == "1" && response[0].user_photos=="1"){
					listenerFunction(true, null, uid, null);
				}
				else{
					showErrorOrSuccess("Desculpe, mas você precisa completar o processo de autorização.", listenerFunction);
					FB.logout(function(response) {
					  //window.location.reload();
					  setTimeout(top.location.href = "./resolveAuth.html", 1000);
					});
							
			}				
		   }else{
			   showErrorOrSuccess("A publicação falhou. Por favor tente novamente.", listenerFunction);
		   };
			
		});
		/////////
	}
	/////
	var PostFeedToFacebook = function ( userID, authToken, filename, mimeType, message, listenerFunction ){
	  	//to the wall only
		var wallPost = {
				message : message,
			};
		FB.api('/me/feed', 'post', wallPost , function(response) {
		  if (!response || response.error) {
			//console.log(response);
			listenerFunction(false, null, null);
		  } else {
			//console.log(response);
			listenerFunction(true, JSON.stringify(response.id), userID);
		  }
		});
		
	}
	//////

	var PostImageToFacebook = function ( userID, authToken, filename, mimeType, imageData, message, listenerFunction ){
	 
		FB.api('/me/photos?access_token='+authToken, 'post', { url: imageData, access_token: authToken, message:message }, 
			function(response) {
                if (!response || response.error) {
                	 //console.log(response);
					listenerFunction(false, null, null);
                  } else {
                    //console.log(response);
					listenerFunction(true, JSON.stringify(response.id), userID);
                  }
            }
		);
		/////
	  
	}
	////
	var showErrorOrSuccess = function(errorMessage, listenerFunction){
		listenerFunction(false, null, null, errorMessage);
		
	}
	
//////public

return {
	loginFB : function (listenerFunction) {
		loader = new ajaxLoader(jQuery('html'));
		//Check to see if the user has authenticated the App.
		FB.getLoginStatus(function(response) {
	
			if (response.status === 'connected') {
				
				queryAuths(response.authResponse.userID, listenerFunction);
	
			} else {
	
				//If they haven't, call the FB.login method
				FB.login(function(response) {
	
					if (response.authResponse) {
	
					   queryAuths(response.authResponse.userID, listenerFunction);
					   
					} else {
						showErrorOrSuccess("Você precisa autorizar a aplicação para participar.", listenerFunction);
					}
				}, {scope: 'publish_stream, user_photos'});
			}
		});
	},

	getPhotos : function(listenerFunction){
		/*if(!this.PhotoExists){
			FB.api({
		        method: 'fql.query',
		        query: 'SELECT src, src_big, caption FROM photo WHERE owner=me()'
			}, function getPhotoAlbum(result){
			            //var photo  = [];
			            var photos = $("#photos ul");
			            if(result){
							var numPics = 0;
			                for (var i = 0; i < result.length; i++) {
								//excluindo fotos que já foram publicadas							
			                    if(result[i]["caption"].indexOf("#CompartilheValores") == -1){
			                        //photo.push([result[i]["src"], result[i]["src_big"]]);
	                    			photos.append(criaPhotos( result[i], i+1));	
									numPics++;								
			                    }  
								//
								if(numPics == 30)i=result.length;
								 
			                }  
			                jQuery("#photos ul li").click(function(e) {
						        jQuery('#imgUpper').children().remove();
						        var str_img = jQuery(this).find('img').attr('rel');
								var srcToLoad = "./scripts/proxy.php?src=" + str_img;
								loadImage(srcToLoad);
						        jQuery('#imgUpper').append("<img src='"+str_img+"'/>");
								jQuery(".modalPhotos").fadeOut(750);
								//
								ga('send', 'event', 'CV', 'clique', 'Foto_fb');
						    });
							//
							
			            }         		        
			        }
			);
			this.PhotoExists = true;
		} else {
		}*/


		// reset and show album selector
		selector.reset();
		selector.showAlbumSelector(globalUserID);
		
	},

	publishImageFinal : function(listenerFunction){
		alert('Fail shared');
	},

	publishImageToWall : function (imageToPublish, message, listenerFunction) {
	
		//Check to see if the user has authenticated the App.
		FB.getLoginStatus(function(response) {
	
			if (response.status === 'connected') {
				
				queryAndPrepareToPostImage(response.authResponse.userID, response.authResponse.accessToken, imageToPublish, message, listenerFunction);
	
			} else {
	
				//If they haven't, call the FB.login method
				FB.login(function(response) {
	
					if (response.authResponse) {
	
					   queryAndPrepareToPostImage(response.authResponse.userID, response.authResponse.accessToken, imageToPublish, message, listenerFunction);
					   
					} else {
						showErrorOrSuccess("Você precisa autorizar a aplicação para participar.", listenerFunction);
					}
				}, {scope: 'publish_stream, user_photos'});
			}
		});
	},
	
	publishImageToWallWithUserName : function (imageToPublish, message, listenerFunction) {
	
		//Check to see if the user has authenticated the App.
		FB.getLoginStatus(function(response) {
	
			if (response.status === 'connected') {
				FB.api('/me', function(responseMe) {
						//alert("Name: "+ response.name + "\nFirst name: "+ response.first_name + "ID: "+response.id);
						//var img_link = "http://graph.facebook.com/"+response.id+"/picture"
						var userName = responseMe.first_name + " " + responseMe.last_name;
						queryAndPrepareToPostImage(response.authResponse.userID, response.authResponse.accessToken, imageToPublish, userName + " " + message, listenerFunction);
					});
	
			} else {
	
				//If they haven't, call the FB.login method
				FB.login(function(response) {
	
					if (response.authResponse) {
	
					   FB.api('/me', function(responseMe) {
						//alert("Name: "+ response.name + "\nFirst name: "+ response.first_name + "ID: "+response.id);
						//var img_link = "http://graph.facebook.com/"+response.id+"/picture"
						var userName = responseMe.first_name + " " + responseMe.last_name;
						queryAndPrepareToPostImage(response.authResponse.userID, response.authResponse.accessToken, imageToPublish, userName + " " + message, listenerFunction);
					});
					   
					} else {
						showErrorOrSuccess("Você precisa autorizar a aplicação para participar.", listenerFunction);
					}
				}, {scope: 'publish_stream, user_photos'});
			}
		});
	},
	
	publishFeedToWall : function (message, listenerFunction) {
	
		//Check to see if the user has authenticated the App.
		FB.getLoginStatus(function(response) {
	
			if (response.status === 'connected') {
				
				queryAndPrepareToPostFeed(response.authResponse.userID, response.authResponse.accessToken, message, listenerFunction);
	
			} else {
	
				//If they haven't, call the FB.login method
				FB.login(function(response) {
	
					if (response.authResponse) {
	
					   queryAndPrepareToPostFeed(response.authResponse.userID, response.authResponse.accessToken, message, listenerFunction);
					   
					} else {
						showErrorOrSuccess("Você precisa autorizar a aplicação para participar.", listenerFunction);
					}
				}, {scope: 'publish_stream, user_photos'});
			}
		});
	}
//end of return public	
};
	
})();

	
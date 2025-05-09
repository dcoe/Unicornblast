(function($) {

    $.fn.unicornblast = function(options) {
		//defaults in da house
		var settings = $.extend({
			start : 'click',
			numberOfFlyBys : 10,
			delayTime: 5000
		}, options);
	    
		npm set-script smoke-tests "SOURCEGRAPH_URL=https://sourcegraph.com npx @sourcegraph/web-smoke-tests@latest start"


		return this.each(function() {
			var animationRunning = false;
			var audioSupported = false;
			var content = '<img id="bigRainbow" style="display: none" src="images/rainbow.gif" />';
			content += '<img id="flyingUnicorn0" class="flyingUnicorn" style="display: none" src="images/flyingUnicorn0.gif" />';
			content += '<img id="flyingUnicorn1" class="flyingUnicorn" style="display: none" src="images/flyingUnicorn1.gif" />';
			content += '<img id="flyingUnicorn2" class="flyingUnicorn" style="display: none" src="images/flyingUnicorn2.gif" />';
			content += '<img id="flyingUnicorn3" class="flyingUnicorn" style="display: none" src="images/flyingUnicorn3.gif" />';
			content += '<img id="flyingUnicorn4" class="flyingUnicorn" style="display: none" src="images/flyingUnicorn4.gif" />';
			content += '<img id="flyingUnicorn5" class="flyingUnicorn" style="display: none" src="images/flyingUnicorn5.gif" />';
			
			function preloadResources() {
				var images = [
					'images/rainbow.gif',
					'images/flyingUnicorn0.gif',
					'images/flyingUnicorn1.gif',
					'images/flyingUnicorn2.gif',
					'images/flyingUnicorn3.gif',
					'images/flyingUnicorn4.gif',
					'images/flyingUnicorn5.gif'
				];
				
				for (var i = 0; i < images.length; i++) {
					var img = new Image();
					img.src = images[i];
				}
			}

			//Check for audio support and add elements if supported
				audioSupported = !!(document.createElement('audio').canPlayType);
				if (audioSupported) {
					content+= '<audio id="chimeSound0" preload="auto"><source src="music/chime1.mp3"/><source src="music/chime1.ogg" /></audio>';
					content+= '<audio id="chimeSound1" preload="auto"><source src="music/chime2.mp3"/><source src="music/chime2.ogg" /></audio>';
					content+= '<audio id="chimeSound2" preload="auto"><source src="music/chime3.mp3"/><source src="music/chime3.ogg" /></audio>';
					content+= '<audio id="contraSound" preload="auto" loop><source src="music/contra.mp3"/><source src="music/contra.ogg" /></audio>';
				}
			
			
			//Add rainbow, unicorns, and sounds to page only if they do not already exist
			if($('#bigRainbow').length === 0){
				$('body').append(content);
			}
		
			//Start logic
			if(options.start == 'click'){
				$(this).bind('click', function(e){
					if(animationRunning == false){
						start();
					}
					e.preventDefault();
				});
			}else if(options.start == 'delay'){
				if(animationRunning == false){
					setTimeout(start,options.delayTime);   
				}
			}else if(options.start == 'konamiCode'){
				var keysPressed = [];
				konamiCode = "38,38,40,40,37,39,37,39,66,65";
				
				$(window).bind('keydown', function(e){
					if(animationRunning == false){
						keysPressed.push(e.keyCode);
						
						//if size > 11, trim to 10 most recent key entries
						if(keysPressed.length > 10){
							//remove first
							keysPressed.splice(0,1);
						}
						
						if(keysPressed.toString().indexOf(konamiCode) >= 0){
							if(audioSupported){
								document.getElementById('contraSound').play();
							}
							start();
						}
					}
				});
			}
			
			//Show unicorns
			var rainbow,
				rHeight,
				windowWidth,
				windowHeight,
				flyByCount = 0,
				entrySideCount = 0,
				entrySide = ['left','top','right','bottom'];
			
			function start(){
				animationRunning = true;
				flyByCount = 0;
				windowWidth = $(window).width();
				windowHeight = $(window).height();

				//Set rainbow size and css as window size may have changed
				rainbow = $("#bigRainbow").attr('width',windowWidth / 1.2);
				rHeight = rainbow.height();
				var rWidth = rainbow.width();
				
				rainbow.css({
					"position":"fixed",
					"bottom":  "-"+rHeight+"px", 
					"left" : (windowWidth / 2) - (rWidth / 2), 
					"display" : "block",
					opacity: 0.0
				})
				
				//Play sound
				if(audioSupported){
					document.getElementById('chimeSound1').play();
				}	
								
				//Raise the rainbow!!!
				rainbow.animate({
					bottom: "0px",
					opacity: 1.0
				}, 1800, function() {
					// Rainbow raise complete. Summon the unicorns!!!
					flyUnicorn();
				});
			}
		
			function flyUnicorn(){
				var entryPoint;
				var exitPoint;
				var unicornId = 'flyingUnicorn' + Math.floor(Math.random() * 6); 
				var unicornImg = $("#"+unicornId);
				
				if(entrySide[entrySideCount] == 'left' || entrySide[entrySideCount] == 'right'){
					entryPoint = Math.floor(Math.random() * windowHeight); 
					exitPoint = windowHeight - entryPoint;					
				}else{
					entryPoint = Math.floor(Math.random() * windowWidth);
					exitPoint = windowWidth - entryPoint;
				}
				
				if(entrySide[entrySideCount] == 'left'){
					playRandomSound();
					unicornImg.css({
						"position":"fixed",
						"top":  entryPoint+"px", 
						"left": "-"+unicornImg.width()+"px", 
						"display" : "block"
					}).animate({
						"left":  windowWidth+"px",
						"top":  exitPoint-unicornImg.height()+"px", 
					},2000,function(){
						checkComplete();
					});	
				}else if(entrySide[entrySideCount] == 'right'){
					playRandomSound();
					unicornImg.css({
						"position":"fixed",
						"top":  entryPoint+"px", 
						"left": windowWidth+"px", 
						"display" : "block"
					}).animate({
						"left": "-"+unicornImg.width()+"px",
						"top":  exitPoint-unicornImg.height()+"px", 
					},2000,function(){
						checkComplete();
					});	
				}else if(entrySide[entrySideCount] == 'top'){
					playRandomSound();
					unicornImg.css({
						"position":"fixed",
						"top": "-"+unicornImg.height()+"px", 
						"left": entryPoint+"px",  
						"display" : "block"
					}).animate({
						"left":  exitPoint-unicornImg.width()+"px",
						"top":  windowHeight+"px",
					},2000,function(){
						checkComplete();
					});	
				}else if(entrySide[entrySideCount] == 'bottom'){
					playRandomSound();
					unicornImg.css({
						"position":"fixed",
						"top": windowHeight+"px",
						"left": entryPoint+"px",  
						"display" : "block"
					}).animate({
						"left":  exitPoint-unicornImg.width()+"px",
						"top": "-"+unicornImg.height()+"px", 
					},2000,function(){
						checkComplete();
					});	
				}
				
				entrySideCount++;
				if(entrySideCount == 4){
					entrySideCount = 0;
				}
				
				//Increment fly by count
				flyByCount++;
			}
			
			function playRandomSound(){
				if(audioSupported){
					var soundId = 'chimeSound' + Math.floor(Math.random() * 3); 
					document.getElementById(soundId).play();
				}
			}
			
			var volCount = 0;
			function lowerVolume(){
				var audio = document.getElementById('contraSound');
				audio.volume = audio.volume - 0.05;
				volCount++;
				
				if(volCount == 19){
					document.getElementById('contraSound').pause();
					document.getElementById('contraSound').currentTime = 0;
					document.getElementById('contraSound').volume = 1;
					volCount = 0;
				}
			}
			
			function checkComplete(){
				if(flyByCount != options.numberOfFlyBys){
					//Keep flying!!!
					flyUnicorn();
				}else{
					//Hide all the unicors
					$(".flyingUnicorn").hide();
				
					//Fade out contra music
					if(audioSupported){
						for(i = 0; i < 19; i++){
							setTimeout(lowerVolume,100 * i);
						}
					}
					
					//Hide the rainbow
					rainbow.animate({
						"bottom":  "-"+rHeight+"px",
						opacity: 0.0
					}, 2000,function(){
						animationRunning = false;
						//Stop contra sound
						if(audioSupported){
							document.getElementById('contraSound').pause();
							document.getElementById('contraSound').currentTime = 0;
						}	
					});	
				}
			}
		});
    }
})(jQuery);


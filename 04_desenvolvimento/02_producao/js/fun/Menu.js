var Menu = {
	chaptersNumber: 1,

	creatMenu: function (){
		var toMenuString = ''
		var subNumber = 0;

		$("#spacer").css("height", $("#top").height());
		$("#menuOpacity").click(Menu.workMenu);


		for(var w = 0; w < Player.totalPages; w++){
			switch(Main.menuStyle){
				case 'pages':
					toMenuString += '<div id="'+(w+1)+'" class="menuNavClass">'+ (w+1) + '. ' + course_structure[w][1] + '</div>';
				break
				case 'chapters':
					if(course_structure[w][2]) {
						toMenuString += '<div id="' + Menu.chaptersNumber + '" class="menuNavClass" pageToGo="'+ (w+1) + '">'+ Menu.chaptersNumber + '. ' + course_structure[w][3] + '</div>';
						Menu.chaptersNumber += 1;
					};
				break
				case 'retratil':
					subNumber += 1;
					if(course_structure[w][2]) {
						if(Menu.chaptersNumber > 1) { toMenuString += '</div>'; subNumber = 1;}
						toMenuString += '<div id="' + Menu.chaptersNumber + '" class="chapterNavClass" retratilNumber="'+ Menu.chaptersNumber + '" pageToGo="'+ (w+1) + '">'+ Menu.chaptersNumber + '. ' + course_structure[w][3] + '</div>';
						toMenuString += '<div id="pagesContainer' + Menu.chaptersNumber + '" class="pagesContainer">';
						toMenuString += '<div id="sub' + subNumber + '_'+ Menu.chaptersNumber + '" class="subMenuNavClass" style="display: none;" pageToGo="'+ (w+1) + '">' + course_structure[w][1] + '</div>';
						Menu.chaptersNumber += 1;
					}else{
						toMenuString += '<div id="sub' + subNumber + '_'+ (Menu.chaptersNumber-1) + '" class="subMenuNavClass" style="display: none;" pageToGo="'+ (w+1) + '">' + course_structure[w][1] + '</div>';
					}
				break;
			}	
		}
		var menuString = toMenuString;
		$('#navOptions').html(menuString);
		Menu.setColor();
		Menu.updateMenuStatus();

	},

	workRetratil: function (arg){
		$("#pagesContainer" + arg + "> div").css('position') == 'absolute' ? Menu.openRetratil(arg) : Menu.closeRetratil(arg);
	},

	openRetratil: function (arg){
		$("#pagesContainer" + arg + "> div").css('display', 'block');
		$("#pagesContainer" + arg + "> div").css('margin-bottom', '16px');
		$("#pagesContainer" + arg + "> div").css('position', 'relative');
	},

	closeRetratil: function (arg){
		$("#pagesContainer" + arg + "> div").css('display', 'none');
		$("#pagesContainer" + arg + "> div").css('margin-bottom', '0px');
		$("#pagesContainer" + arg + "> div").css('position', 'absolute');
	},

	updateMenuStatus: function (){
		if(Main.menuStyle == undefined) Main.menuStyle = 'pages';
		switch(Main.menuStyle){
			case 'pages':
				for(var w = 0; w < Player.totalPages; w++){
					var option = $('#'+(w+1));

					if(Player.maxPageVisited < (w+1) && !Main.habilitarNavegacao){
						Menu.switchMenuEnabled(option, false);
					}else{
						option.attr('onclick', 'Player.updatePage('+ (w+1) + ', "menu")');
						Menu.switchMenuEnabled(option, true);
					}
				};
			break
			case 'chapters':
				for(var w = 0; w < Menu.chaptersNumber; w++){
					var option = $('#'+(w+1));

					if(Player.maxPageVisited < $(option).attr('pageToGo') && !Main.habilitarNavegacao){
						switchMenuEnabled(option, false);
					}else{
						option.attr('onclick', 'Player.updatePage('+ $(option).attr('pageToGo') + ', "menu")');
						Menu.switchMenuEnabled(option, true);
					}
				};
			break
			case 'retratil':
				for(var w = 0; w < Menu.chaptersNumber; w++){
					var option = $('#'+(w+1));

					if(Player.maxPageVisited < $(option).attr('pageToGo') && !Main.habilitarNavegacao){
						Menu.switchMenuEnabled(option, false);
					}else{
						option.attr('onclick', 'Menu.workRetratil('+ $(option).attr('retratilNumber') + ', "menu")');
						Menu.switchMenuEnabled(option, true);
					};

					for(var j = 0; j < $("#pagesContainer" + w + "> div").length; j++){
						var subOption = $('#sub'+(j+1)+'_'+w);

						if(Player.maxPageVisited < $(subOption).attr('pageToGo') && !Main.habilitarNavegacao){
							Menu.switchMenuEnabled(subOption, false);
						}else{
							subOption.attr('onclick', 'Player.updatePage('+ $(subOption).attr('pageToGo') + ', "menu")');
							Menu.switchMenuEnabled(subOption, true);
						}
						
					};

				};
			break
		};
	},

	workMenu: function (){
		var menu = $('#courseMenu');	
		var menuButton = $('#menuButton');
		menuButton.off(); //enable false
		if(menu.css("display") == 'none'){
			menu.css('display', 'block');
			menu.animate( {opacity: '1', left: '0'}, 300, 
				function() { 
					Menu.updateProgressBar();
					menuButton.click(Menu.workMenu); 
				}
			);
		}else{
			menu.animate( {opacity: '0',  left: '-80'}, 300, 
				function(){ 
					menu.css('display', 'none'); 
					menuButton.click(Menu.workMenu); 
					if(Main.menuStyle == 'retratil') for(var w = 1; w <= Menu.chaptersNumber; w++) Menu.closeRetratil(w);
				} 
			);
		};

		$("#navMenu").css("height", 660 - ( $("#spacer").height() + $("#optionsMenu").height() + $("#extraButtons").height() ) - 10);
	},

	switchMenuEnabled: function (arg1, arg2){
		arg1.css('opacity', arg2 ? '1' : '0.3');
		arg1.css('cursor', arg2 ? 'pointer' : 'default');
		arg1.attr('title', arg2 ? 'Clique para ver sobre esse assunto.' : '');
	},

	updateProgressBar: function (){
		if(document.getElementById("courseProgressBar")){
			var toMove = (document.getElementById("courseProgressBar").offsetWidth ) * Player.maxPageVisited/Player.totalPages;
			$("#progressNumber").html(Math.round((Player.maxPageVisited/Player.totalPages) * 100) + '%');
			$("#progressSlider").animate( {width: toMove}, 150);
		}
	},

	showHideSubtitle: function  (){
		Subtitle.showSubtitle = !Subtitle.showSubtitle;
		if($('#subtitle').html() != '') $('#subtitle').css('display', Subtitle.showSubtitle == false ? 'none' : 'block');
		Menu.changeButtonClass("subtitleButton", Subtitle.showSubtitle);
	},

	onOffAudio: function (){
		Subtitle.playAudio = !Subtitle.playAudio;
		$("#locution").prop("volume", Subtitle.playAudio ? 1 : 0);
		$("#audioImg").attr("src", Subtitle.playAudio ? "styles/img/menu/audio.png" : "styles/img/menu/audio_off.png");
		Menu.changeButtonClass("audioButton", Subtitle.playAudio);
	},

	quitCourse: function (){
		try{
			if(self.top != null) self.top.close();
			if(self != null) self.close();
			window.close();
			return;
		}	
		catch(e){}
	},
	
	changeButtonClass: function (arg1, arg2){	
		eval("$('#" + arg1 + "')").attr('class', !arg2 ? 'offButtonClass' : 'buttonClass'); 
	},

	setColor: function(){
		$("#menuBackground").css("background-color", Main.corDoCurso);
		$(".buttonClass").css("background-color", Main.corDoCurso);
	},

	openPopUp: function(arg){
		//arg - pagina que irá abrir
		console.log()
		$('#popFrames').attr('src', 'extras/' + arg);
		$('#popFrames').css('display', 'block');
	},

	closePopUp: function(){
		$('#popFrames').css('display', 'none');
		$('#popFrames').attr('src', '');
	}
}
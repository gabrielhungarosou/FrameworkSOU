var Subtitle = {
	currentSubtitle: [],
	showSubtitle: true, 
	sawSubtitles: [], //Legenda ja vistas pelo estudante
	playAudio: true,
	theAvatar: null,
	pageArray: [],	
	w: 0,

	getPageSubtitles: function (arg){
		Subtitle.currentSubtitle = [];
		for(var w = 0; w < subtitleArray.length; w++){
			if(subtitleArray[w][0] == arg){
				for(var j = 1; j < subtitleArray[w].length; j++) Subtitle.currentSubtitle.push(new Array(subtitleArray[w][j][0], subtitleArray[w][j][1], subtitleArray[w][j][2]));
			};
		};
		Subtitle.buildNavBalls();
		Subtitle.pageArray = arg.split(".")
		Subtitle.locutionPreloader(Subtitle.pageArray[0]); 
	},

	buildNavBalls: function (arg1, arg2){
		var content = '';
		var widthToGo = 27 * ((arg2 == 'exercise') ? arg1 : Subtitle.currentSubtitle.length );

		Subtitle.hideBalls();

		$("#pageNavigation").css('width', widthToGo);
		$("#pageNavigation").css('margin-left', ( (widthToGo/2) * -1 ));

		for(var w = 0; w < ((arg2 == 'exercise') ? arg1 : Subtitle.currentSubtitle.length ); w++) content += '<div id="ball' + w + '" class="navBall"></div>';

		$("#pageNavigation").html(content);
	},

	activeBall: function (arg1, arg2, arg3){
		for(var w = 0; w < ((arg2 == 'exercise') ? arg1 : Subtitle.currentSubtitle.length ); w++){
			$("#ball"+w).css('background-color', 'rgba(255, 255, 255, 0.1)');
			$("#ball"+w).css('border-color', '#8c8c8c');
			$("#ball"+w).attr('title', '');
		};
		$("#ball"+arg1).css('background-color', 'rgba(255, 255, 255, 0.7)');
		$("#ball"+arg1).css('border-color', '#262626');
		$("#ball"+arg1).attr('title', ((arg2 == 'exercise') ? 'Exercício ' : 'Legenda ' ) + (arg1 + 1) + ' de ' + ((arg2 == 'exercise') ? arg3 : Subtitle.currentSubtitle.length ));
		$('#pageNavigation').css('display', 'block');
	}, 

	hideBalls: function(){
		$("#pageNavigation").css('display', 'none');
		$("#pageNavigation").html('');
	},

	setSubtitle: function (arg){
		var subtitleToShow;
		Player.doSeguir();

		for(var w = 0; w < Subtitle.currentSubtitle.length; w++){
			if(Subtitle.currentSubtitle[w][0] == arg) {
				Subtitle.theAvatar = Subtitle.currentSubtitle[w][1];
				subtitleToShow = Subtitle.currentSubtitle[w][2];
				Subtitle.activeBall(w);
			};
		};
		if(subtitleToShow == undefined) return;

		Subtitle.clearSubtitle();
		
		$('#subtitle').html(subtitleToShow);
		var topToGo = ( $('#player').height() - $('#subtitle').height() ) - 46;
		$('#subtitle').css('top', topToGo);
		if(Subtitle.showSubtitle) $('#subtitle').css('display', 'block');

		$('#locution').attr('src', 'loc/' + Subtitle.pageArray[0] + '_' + arg + '.mp3');

	},

	startLocution: function (){
		$('#pauseButton').css('display', 'block');	
		$("#locution").trigger("play");
		Subtitle.avatarTalk();
		$("#pauseIcon").attr('class', 'pauseButtonIcon');
	},

	locutionPause: function (){
		Subtitle.avatarShutUp();
		$("#locution").trigger("pause");
		$("#pauseIcon").attr('class', 'playButtonIcon');
	},

	playPause: function (){ 
		($("#pauseIcon").attr('class') == 'playButtonIcon') ? Subtitle.startLocution() : Subtitle.locutionPause(); 
	},

	locutionEnd: function (){ 
		Subtitle.avatarShutUp(); 
		Main.autoPlay ? Player.nextPageAction('locEnd') : $('#pauseButton').css('display', 'none');
	},

	clearSubtitle: function (){
		$("#locution").trigger("pause");
		Subtitle.avatarShutUp();
		$('#subtitle').html('');
		$('#subtitle').css('display', 'none');
		$('#pauseButton').css('display', 'none');
	},

	avatarShutUp: function (){
		if(Subtitle.theAvatar == null) return;
		var curAvatar = "$('#pageFrame')[0].contentWindow.exportRoot." + Subtitle.theAvatar;
		if(eval("$('#pageFrame')[0].contentWindow.exportRoot." + Subtitle.theAvatar)){
			eval(curAvatar + ".gotoAndStop(0)");
			eval(curAvatar + ".head_mc.mouth_mc.gotoAndStop(0)");
		};
	},

	avatarTalk: function (){
		var curAvatar = "$('#pageFrame')[0].contentWindow.exportRoot." + Subtitle.theAvatar;
		if(eval("$('#pageFrame')[0].contentWindow.exportRoot." + Subtitle.theAvatar)){
			eval(curAvatar + ".play()");
			eval(curAvatar + ".head_mc.mouth_mc.play()");
		};
	},

	locutionPreloader: function (arg1, arg2){
		if(Subtitle.currentSubtitle[Subtitle.w] == undefined) return;
		var src = ('loc/' + arg1 + '_' + Subtitle.currentSubtitle[Subtitle.w][0] + '.mp3');

	    $.ajax({
	        url: src,
	        success: function() {
	            Subtitle.w += 1;
	            (Subtitle.currentSubtitle[Subtitle.w]) ? Subtitle.locutionPreloader(arg1) : Subtitle.w = 0;
	        }
	    });
	}
}
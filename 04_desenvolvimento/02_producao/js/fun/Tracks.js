var Tracks = {
	FXloop: false,
	callFXhtml: function (src, loop){
		Tracks.FXLoop = loop ? true : false;
		$('#soundFX').attr('src', "music/"+src);
		$("#soundFX").trigger("load");
	},
	playFX: function (){
		$("#soundFX").trigger("play");
	},
	stopFX: function (){
		$("#soundFX").trigger("pause");
	},
	checkLoop: function (){
		if(Tracks.FXLoop){ 
			document.getElementById('soundFX').currentTime = 0
			$("#soundFX").trigger("play");
		}
	}
}
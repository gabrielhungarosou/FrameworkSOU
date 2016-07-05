//COMUNICAÇÃO SCORM
var Lms = {
	isOn: false,
	LMSLocation: null,
	getValue: function(arg1){
		var action = parent.doLMSGetValue;
		switch (arg1){
			case 'location': return action('cmi.core.lesson_location'); break
			case 'score': return action('cmi.core.score.raw'); break
			case 'maxScore': return action('cmi.core.score.max'); break
			case 'minScore': return action('cmi.core.score.min'); break
			case 'status': return action('cmi.core.lesson_status'); break
		}
	},
	setValue: function(arg1, arg2){
		var action = parent.doLMSSetValue;
		switch (arg1){
			case 'location': action('cmi.core.lesson_location', Player.currentPage + '/' + Player.maxPageVisited);	break
			case 'score': action('cmi.core.score.raw', arg2); break
			case 'maxScore': action('cmi.core.score.max', 100); break
			case 'minScore': action('cmi.core.score.min', Main.minScore); break
			case 'status': action('cmi.core.lesson_status', arg2); break
		}
		parent.doLMSCommit();
	},
	callBookmark: function(){
		if(confirm('Deseja retornar a última tela visitada?')){
			var string = Lms.LMSLocation.split("/");
			Player.updatePage(string[0], 'next');
		}
	}
}
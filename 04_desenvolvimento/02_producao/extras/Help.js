var Help = {
	tips: [	"Utilize as <b>setas laterais</b> para avançar ou voltar ao conteúdo anterior.", 
			"A <b>legenda</b> aparecerá na parte inferior da tela. As <b>bolinhas</b> abaixo da legenda indicam quantas falas existem nesta cena.", 
			"O <b>nome do treinamento</b> estará no topo.", 
			"<b>Abaixo do nome</b>, você verá em qual parte está do treinamento e o assunto abordado.", 
			"Deixe o <b>mouse sobre o item</b> para ver sua definição."],

	currentTip: -1,

	init: function(){
		if(parent.Menu){
			$('#quitHelp').click(parent.Menu.closePopUp);
			$('#background').click(parent.Menu.closePopUp);
		}
		Help.writeTip("goOn");
	},

	writeTip: function(arg){
		$("#prevArrow").off();
		$("#nextArrow").off();

		if(arg == "goOn"){
			if(Help.currentTip != (Help.tips.length-1)){
				Help.currentTip += 1;
			}else{
				return;
			}
		}else{
			if(Help.currentTip != 0){
				Help.currentTip -= 1;
			}else{
				return;
			}
		}

		$("#explain").html(Help.tips[Help.currentTip]);
		$('#explain').css("opacity", "0");
		$('#explain').animate( {opacity: '1'}, 200);	
		
		Help.updateBalls();

		$("#nextArrow").css("opacity", Help.currentTip == Help.tips.length-1 ? "0.3" : "1");
		$("#prevArrow").css("opacity", Help.currentTip == 0 ? "0.3" : "1");
	},

	updateBalls: function(){
		for(var w = 0; w < Help.tips.length; w++){
			$("#" + w + "_help").attr("class", "ballOffHelp");
			if(w == Help.currentTip) $("#" + w + "_help").attr("class", "ballOnHelp");
		}
	}
}
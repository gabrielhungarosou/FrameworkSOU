var Exercise = {
	score: 0,
	currentExe: 1,
	reviewMode: false,
	canIRandom: true,
	currentTrys: null,
	currentEnun: null,
	choicesArray: [],
	totalQuestions: 0,
	allUserAnswers: [],
	questionsArray: [],
	currentChoices: null,
	currentFeedback: null,
	currentRandomize: false,
	currentUserChoice: null,
	currentCorrectAnswer: null,
	answersToMultiChoices: [],
	
	countQuestions: function(){
		//Conto o total de questões
		while(eval("exercise_" + (Exercise.totalQuestions+1) )){
			Exercise.allUserAnswers.push(new Array());
			Exercise.totalQuestions += 1;
		}
	},

	init: function(){
		$("#exeIntro").html(textoDeIntroducao);
		Exercise.contentBoxPosition();
		
		if(parent.Player) {
			//Escondo o loader do player
			parent.Player.hideLoader();
			$("#exeCourseReview").click(function() { parent.Player.updatePage(1); } );
		}

		$("#exeInit").click(Exercise.createExercise);
		$("#exeReview").click(Exercise.startReviewMode);
	},

	createQuestionsArray: function(){
		if(Exercise.canIRandom){
			Exercise.questionsArray = [];
			for(var w = 1; w <= Exercise.totalQuestions; w++) Exercise.questionsArray.push(w);
			if(tipo == 'avaliacao') Exercise.shuffleArray(Exercise.questionsArray); //randomizo se for avaliacao
		}

		//Controle para randomizar apenas 1 vez;
		Exercise.canIRandom = false;
	},

	createChoicesArray: function(){
		Exercise.choicesArray = [];
		for(var w = 1; w <= Exercise.currentChoices.length; w++) Exercise.choicesArray.push(w);
		if(Exercise.currentRandomize) Exercise.shuffleArray(Exercise.choicesArray); //randomizo se for avaliacao
	},

	shuffleArray: function(a){
		for (i = a.length; i; i -= 1) {
	        j = Math.floor(Math.random() * i);
	        x = a[i - 1];
	        a[i - 1] = a[j];
	        a[j] = x;
		}
	},

	makeBoxToExe: function(){
		$("#exeResult").css("display", "none");
		$("#exeIntro").css("display", "none");
		$("#exeInit").css("display", "none");
		$("#exeConfirm").css("display", "block");
		$("#exeQuestions").css("display", "block");
		$("#exeConfirm").css("left", "0px");
		$("#exeConfirm").css("float", "right");
		
		if(Exercise.totalQuestions > 1){
			$("#exeNext").css("display", "block");
		}else{
			$("#exeConfirm").css("left", "680px");
			$("#exeConfirm").css("float", "none");
		}
	},

	createExercise: function(){
		//Se primeira questão
		if(Exercise.currentExe == 1){
			//Crio array com as questões
			Exercise.createQuestionsArray();

			//Uso as balls de navegação da legenda para o exercicio
			if(parent.Subtitle) parent.Subtitle.buildNavBalls(Exercise.totalQuestions, 'exercise');

			Exercise.workNextExe('disable');
			Exercise.makeBoxToExe();

			if(!Exercise.reviewMode) Exercise.score = 0;

			$("#exeReview").css('display', 'none');
			$("#exeCourseReview").css('display', 'none');
		}

		var exeToWrite = Exercise.questionsArray[Exercise.currentExe-1];

		//Crio o exe
		Exercise.currentExerciseObject = eval("exercise_" + exeToWrite);
		Exercise.currentEnun = eval("exercise_" + exeToWrite + ".enun");
		Exercise.currentChoices = eval("exercise_" + exeToWrite + ".choices");
		Exercise.currentCorrectAnswer = eval("exercise_" + exeToWrite + ".correctAnswer");
		Exercise.currentFeedback = eval("exercise_" + exeToWrite + ".feedback");
		Exercise.currentRandomize = eval("exercise_" + exeToWrite + ".randomizeChoices");

		//Crio um array com as alternativas
		Exercise.createChoicesArray();

		//Reseto var e array com a resposta
		if(Exercise.currentUserChoice != null) Exercise.currentUserChoice = null;
		if(Exercise.answersToMultiChoices.length > 0) Exercise.answersToMultiChoices = [];

		//Escrevo o enunciado
		$("#exeEnun").html(Exercise.currentExe + ") " + Exercise.currentEnun);

		//Crio as alternativas
		var toWrite = "";

		//Para exe de escolhas
		toWrite += "<form id='theChoices'>";

		//Gero a string
		for(var w = 0; w < Exercise.currentChoices.length; w++){
			var choiceID = Exercise.choicesArray[w];
			var choiceName = (Exercise.currentCorrectAnswer.length < 2) ? 'usersChoice' : ('usersChoice_'+w);
			var isThatCorrect = false;

			//Verifico se a alternatriva é correta para a revisão
			if(Exercise.reviewMode && mostrarRespostaCorreta) for(var j = 0; j < (Exercise.currentCorrectAnswer.length); j++) if(choiceID == Exercise.currentCorrectAnswer[j]) isThatCorrect = true;

			toWrite += "<input id='choice_" + choiceID + "' name='" + choiceName + "' class='exeChoice' type='radio' onClick='Exercise.setChoice(" + choiceID + ")'><span " + ( isThatCorrect ? "style='color: green; font-weight: bold;'" : "" ) + ">" + (Exercise.currentChoices[choiceID-1]) + "</span><br>";

		}

		//Para exe de escolhas
		toWrite += "</form>";

		//Escrevo na div
		$("#exeChoices").html(toWrite);

		//Se tiver imagem, a apresento
		Exercise.writeExeImg();

		//Adapto a box
		Exercise.contentBoxPosition();

		//Feedback click enable
		$("#contentFeedbackBox").click(Exercise.closeFeedback);

		if(parent.Player) parent.Player.hideLoader(); //Escondo o loader

		//Uso as balls de navegação da legenda para o exercicio
		if(parent.Subtitle) parent.Subtitle.activeBall(Exercise.currentExe-1, 'exercise', Exercise.totalQuestions);

		//Desabilito botões
		if( Exercise.currentExe == Exercise.totalQuestions ){
			$("#exeConfirm").css("left", "680px");
			$("#exeConfirm").css("float", "none");
			$("#exeNext").css("display", "none");
		}else{
			Exercise.workNextExe('disable');
		}

		//Caso esteja em modo de revisão
		if(Exercise.reviewMode) Exercise.setQuestionToReviewMode();
	},

	writeExeImg: function(){
		$("#exeImgContent").css("display", "none");
		if(Exercise.currentExerciseObject.img != null){
			$("#exeImgContent").css("background-image", "url(../styles/img/exe/" + Exercise.currentExerciseObject.img + ".png)");
			$("#exeImgContent").css("display", "block");
		}
	},

	contentBoxPosition: function(){
		//Adapto a box
		$("#contentBox").css("margin-top", ( $("#contentBox").height() / 2 ) * -1 );
	},

	startReviewMode: function(){
		Exercise.reviewMode = true;
		Exercise.createExercise();
	},

	setQuestionToReviewMode: function(){
		//Mostro as escolhas feitas pelo usuario, se tiver varias respostas certas...
		if(Exercise.currentCorrectAnswer.length < 2){
			document.getElementById('choice_'+Exercise.allUserAnswers[Exercise.currentExe-1][0]).checked = true;
		}else{
			for(var w= 0; w < Exercise.allUserAnswers[Exercise.currentExe-1][0].length; w++) document.getElementById('choice_'+Exercise.allUserAnswers[Exercise.currentExe-1][0][w]).checked = true;
		}

		(Exercise.currentExe != Exercise.totalQuestions) ? Exercise.workNextExe("enable") : Exercise.workConfirm("enable");
		
		//Desabilito escolhas
		Exercise.desableChoices();
	},

	setChoice: function(arg){
		if(Exercise.currentCorrectAnswer.length < 2){
			Exercise.currentUserChoice = arg;
		}else{
			$("#BtClearChoices").css("display", "block");
			$("#BtClearChoices").click(Exercise.clearChoices);

			//Só adicono a resposta na array se ela ainda não foi incluida
			for(var w = 0; w < Exercise.answersToMultiChoices.length; w++){
				if(Exercise.answersToMultiChoices[w] == arg){
					return;
				}
			}
			Exercise.answersToMultiChoices.push(arg);
		}

		//Apresento o cofnrimar
		Exercise.workConfirm("enable");
	},

	workConfirm: function(arg){
		if(arg == "enable"){
			$("#exeConfirm").css("opacity", "1");
			$("#exeConfirm").css("cursor", "pointer");

			$("#exeConfirm").off();
			$("#exeConfirm").click(Exercise.confirmUserAnswer);
		}else{
			$("#exeConfirm").css("opacity", "0.3");
			$("#exeConfirm").css("cursor", "default");
			$("#exeConfirm").off();
		};
	},

	workNextExe: function(arg){
		if(arg == "enable"){
			$("#exeNext").css("display", "block");
			$("#exeNext").css("opacity", "1");
			$("#exeNext").css("cursor", "pointer");

			$("#exeNext").off();
			$("#exeNext").click(Exercise.callNextQuestion);
		}else{
			$("#exeNext").css("opacity", "0.3");
			$("#exeNext").css("cursor", "default");
			$("#exeNext").off();
		};
	},

	confirmUserAnswer: function (){
		//Escondo botao
		Exercise.workConfirm('disable');

		//Desabilito o botão para limpar escolhas
		if($("#BtClearChoices").css("display") == "block") $("#BtClearChoices").css("display", "none");

		//Se não estiver em modo de exibição
		if(!Exercise.reviewMode){

			//Limpo o campo e guardo a resposta do usuario no array
			Exercise.allUserAnswers[Exercise.currentExe-1] = [];
			Exercise.allUserAnswers[Exercise.currentExe-1].push( (Exercise.currentUserChoice != null) ?  Exercise.currentUserChoice : Exercise.answersToMultiChoices);	

			//caso tenha só 1 resposta correta
			if(Exercise.currentCorrectAnswer.length < 2){

				//caso não tenha feedback pra cada alternativa
				if(Exercise.currentFeedback._1 == undefined){
					$("#contentFeedback").html( (Exercise.currentUserChoice == Exercise.currentCorrectAnswer[0]) ? Exercise.currentFeedback.positive : Exercise.currentFeedback.negative);
					
				}else{
					$("#contentFeedback").html( eval("Exercise.currentFeedback._" + Exercise.currentUserChoice) );
				}

				if(Exercise.currentUserChoice == Exercise.currentCorrectAnswer[0]){
					Exercise.addScore(1);
					$("#closeFeedback").css("color", "green");
				}else{
					$("#closeFeedback").css("color", "red");
				}

			}else{
				//Verifico se todas as respostas corretas estão selecionadas
				var corrects = 0;
				for(var w = 0; w < Exercise.currentCorrectAnswer.length; w++){
					for(var j = 0; j < Exercise.answersToMultiChoices.length; j++){
						if(Exercise.answersToMultiChoices[j] == Exercise.currentCorrectAnswer[w]) corrects += 1;
					}
				}
				
				//Conforme o processamento a cima, ecsrevo o feedback
				if(corrects == Exercise.currentCorrectAnswer.length && Exercise.answersToMultiChoices.length == Exercise.currentCorrectAnswer.length){
					$("#contentFeedback").html(Exercise.currentFeedback.positive);
					$("#closeFeedback").css("color", "green");
					Exercise.addScore(1);
				}else{
					$("#contentFeedback").html(Exercise.currentFeedback.negative);
					$("#closeFeedback").css("color", "red");
				}
			}

			//Se for pra mostrar o feedback...
			if(feedbackParaCadaQuestao == true) {
				//Mostro o feedback
				$("#exeFeedback").css("display", "block");
				//Adapto o feedback
				$("#contentFeedbackBox").css("margin-top", ($("#contentFeedbackBox").height() / 2) * -1 );
			}else{
				Exercise.closeFeedback();
			}
		}else{
			Exercise.closeFeedback();
		}

		//desabilito o radio
		Exercise.desableChoices();
	},
	closeFeedback: function (){
		Exercise.answersToMultiChoices = [];
		$("#contentFeedbackBox").off();
		Exercise.currentTrys += 1;

		//Mostro o feedback
		$("#exeFeedback").css("display", "none");

		if(Exercise.currentTrys < numeroDeTentativas && $("#closeFeedback").css("color") == "rgb(255, 0, 0)"){
			Exercise.createExercise();
			return
		}

		//Verifico se ainda tenho exe para mostrar
		if(Exercise.currentExe == Exercise.totalQuestions){
			if(tipo == 'avaliacao'){
				Exercise.showResult();
			}else{
				if(parent.Player) parent.Player.enableNextPage();
			}
		}else{
			//Libero o botão para proxima pergunta
			Exercise.workNextExe('enable');
		}
	},

	showResult: function(){
		//Uso as balls de navegação da legenda para o exercicio
		if(parent.Subtitle) parent.Subtitle.hideBalls();

		$("#exeQuestions").css('display', 'none');
		Exercise.currentExe = 1;

		var feedbackText, scoreText;
		var minScore = (parent.Main) ? parent.Main.minScore : 0;

		if(Exercise.getScoreRate() < minScore){

			//Mudo o estilo
			$("#exeInit").css("left", "0px");
			$("#exeInit").css("float", "right");

			//Mostro os botões
			$("#exeInit").css('display', 'block');
			$("#exeReview").css("display", "block");
			$("#exeCourseReview").css("display", "block");

			scoreText = "<span style='color:red'>" + Exercise.getScoreRate() + "%</span>"
			feedbackText = "<p>Você não atingiu o resultado mínimo para aprovação nesse treinamento.</p><p>Reveja o treinamento e tente novamente.";
		}else{

			//Mostro os botões
			$("#exeReview").css("display", "block");
			$("#exeReview").css("left", "680px");
			$("#exeReview").css("float", "none");

			scoreText = "<span style='color:green'>" + Exercise.getScoreRate() + "%</span>"
			feedbackText = "<p>Parabéns! Você atingiu o resultado mínimo para aprovação nesse treinamento.</p>";
		}

		var toWrite = "<h1>Resultado: " + scoreText + "</h1></p>" + feedbackText;
		$("#exeResult").html(toWrite);
		$("#exeResult").css("display", "block");

		//Reposiciono box de acordo com conteudo
		Exercise.contentBoxPosition();

		//Reseto modo de revisão
		Exercise.reviewMode = false;

		//Gravo nota do aluno
		if(parent.Lms) if(parent.Lms.isOn) parent.Lms.setValue("score", Exercise.getScoreRate());

		//Termino a tela
		if(Exercise.getScoreRate() > minScore) if(parent.Player) parent.Player.enableNextPage();

	},

	callNextQuestion: function(){
		Exercise.currentTrys = 0;
		Exercise.currentExe += 1;
		Exercise.createExercise();
	},

	desableChoices: function(){
		for(var w = 0; w < Exercise.currentChoices.length; w++) document.getElementById("choice_"+(w+1)).disabled = true;
	},

	clearChoices: function(){
		Exercise.workConfirm('disable');
		Exercise.workNextExe('disable');
		$("form#theChoices :input").each(function(){$(this).context.checked = false;});
		Exercise.answersToMultiChoices = [];
		$("#BtClearChoices").css("display", "none");
	},
	addScore: function(arg){
		Exercise.score += arg;
	},
	getScoreRate: function(){
		return Math.round( ( Exercise.score / Exercise.totalQuestions ) * 100 );
	}
}
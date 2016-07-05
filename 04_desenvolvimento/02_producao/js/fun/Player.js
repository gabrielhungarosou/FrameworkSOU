var Player = {
	totalPages: course_structure.length, 
	mostrarSeguir: true, //Variavel que auxilia na verificação de qual ação o botão 'avançar' deve executar e quando deve estar habilitado
	blinkInterval: null,
	backContent: true, 
	maxPageVisited: 0, 
	doContent: true,  //Decide se o botão avançar avança na tela (seguir) ou no curso (avançar);
	seguirArg: null,
	frameToGo: null, 
	currentPage: 1, 
	pagesArray: [], 
	backOrOn: null,
	
	startCourse: function (){
		//Para que a locução toque automatico, o usuario prcisar fazer uma ação para carregar o primeiro audio (só ipad)
		$('#locution').attr('src', 'loc/_blank.mp3');
		$("#locution").trigger("load");

		//escondo a introdução
		$('#introFrame').attr('src', '');
		$('#aberturaDiv').hide();

		//Nome do curso
		$('#courseName').html(courseName);
		$('#courseName').css('left', '+=10'); $('#courseName').css('opacity', '0');
		$('#courseName').animate( {opacity: '1', left: '-=10'}, 500);
		
		//Cliques dos botões
		$("#menuButton").click(Menu.workMenu);
		$("#quitButton").click(Menu.quitCourse);
		$("#helpButton").click(function(){Menu.openPopUp("help.html")});
		$("#prevPage").click(Player.prevPageAction);
		$("#nextPage").click(Player.nextPageAction);
		$("#pauseButton").click(Subtitle.playPause);

		//Se tiver audio e/ou locução habilito o click, se não eu desativo
		if(Main.cursoComLocucao){
			$("#audioButton").click(Menu.onOffAudio);
		}else{
			Menu.onOffAudio();
			$("#audioButton").css("cursor", "default");
		}

		if(Main.cursoComLegenda){
			$("#subtitleButton").click(Menu.showHideSubtitle);
		}else{
			Menu.showHideSubtitle();
			$("#subtitleButton").css("cursor", "default");
		}

		Menu.creatMenu(); //Crio o menu

		//Crio array para os checkpoints;
		for(var w = 0; w < Player.totalPages; w++){ 
			Player.pagesArray.push(new Array()); 
			Subtitle.sawSubtitles.push(new Array());
		}; 

		//Se mobile, habilito o touch para avançar tela
		if(Main.isMobile) {
			myElement = document.getElementById('touchDiv');
			mc = new Hammer(myElement);
			mc.on("swipeleft", function(ev) { if($('#nextPage').css('display') == 'block') $('#nextPage').click(); } );
			mc.on("swiperight", function(ev) { if($('#prevPage').css('display') == 'block') $('#prevPage').click(); } );
			$('#touchDiv').css('display', 'block');
		}

		Player.updatePage(Player.currentPage, 'next'); //Chamo tela

		
	},

	nextPageAction: function (arg){
		if( (doContent && (Player.mostrarSeguir || Main.habilitarNavegacao) ) || arg == 'locEnd' || Player.seguirArg == 'sem flag'){ //Se for para navegar pelo contêudo
			Player.changeNavDisplay('none'); //Escondo os botões de navegação
			Player.backContent = true; //Mudo a variavel para que o botão voltar navegue pelo conteudo, não pelas telas do curso;

			//Se ainda não insirido, insiro o frame atual na array de checkpoint
			if(Player.seguirArg != 'sem flag') {
				var allowPush = true;
				for(var w = 0; w < Player.pagesArray[Player.currentPage-1].length; w++){
					if(Player.pagesArray[Player.currentPage-1][w] == $('#pageFrame')[0].contentWindow.exportRoot.currentFrame) allowPush = false;
				};
				if(allowPush) {
					Player.pagesArray[Player.currentPage-1].push($('#pageFrame')[0].contentWindow.exportRoot.currentFrame);
					Subtitle.sawSubtitles[Player.currentPage-1].push($('#pageFrame')[0].contentWindow.exportRoot.currentFrame);
				};
			};	

			Subtitle.clearSubtitle(); //Se houver legenda, há retiro
			$('#pageFrame')[0].contentWindow.exportRoot.play(); //Dou play na timeline da tela

		}else{ //Se for para navegar pelas telas
			if(Player.currentPage == Player.totalPages) return;
			Player.currentPage += 1;
			Player.updatePage(Player.currentPage, 'next');
		};
	},

	prevPageAction: function (){
		if(Player.backContent){ //Se for para navegar pelo contêudo
			Player.changeNavDisplay('none'); //Escondo os botões de navegação
			doContent = true; //Mudo a variavel para que o botão avançar navegue pelo conteudo, não pelas telas do curso;

			Subtitle.clearSubtitle(); //Se houver legenda, há retiro
			Player.getCheckpoint(); //Checo qual frame ir

			if(Player.pagesArray[Player.currentPage-1].length == 0) Player.backContent = false; //Se não houver mais checkpoint antes do atual, muda o voltar para navegar pelas telas

		}else{//Se for para navegar pelas telas
			if(Player.currentPage == 1) return;
			Player.currentPage -= 1;
			Player.updatePage(Player.currentPage, 'prev');
		};
	},

	//Liberar o botão avançar, usado no fim da tela
	enableNextPage: function (){
		doContent = false; //Mudo a variavel para que o botão avançar navegue pelas telas do curso, não pelo conteudo;
		Player.doSeguir('end'); //Mostro os botões de navegação
		Subtitle.activeBall(Subtitle.currentSubtitle.length + 1); //Ativo a ultima bola (caso exista);
		if(Player.currentPage == Player.totalPages){ $('#nextPage').css('display', 'none'); alert("Parabéns! Você finalizou o treinamento. Essa janela pode ser fechada com segurança."); return;};

		//Faço o blink no avançar se não for a ultima tela;
		window.clearInterval(Player.blinkInterval);
		Player.blinkInterval = window.setInterval(
			function(){
				$("#nextPage").attr("class") == 'navigationClass' ? $("#nextPage").attr("class", "blinkNavClass") : $("#nextPage").attr("class", "navigationClass") 
			}, 500);
	},

	//Faço o botão avançar parar de piscar
	disableNextPage: function (){	
		window.clearInterval(Player.blinkInterval); 
		$("#nextPage").attr("class", "navigationClass"); 
	},

	//Mostrar os botões de navegação
	doSeguir: function (arg){ 
		Player.seguirArg = arg; //Atribuo o arg a uma var global
		Player.disableNextPage(); //Faço o botão avançar parar de piscar

		//Se tiver checkpoint ou não for a primeira tela, mostro o botão voltar
		if(Player.pagesArray[Player.currentPage-1][ Player.pagesArray[Player.currentPage-1].length-1 ] || Player.currentPage != 1) $('#prevPage').css('display', (arg == 'sem flag') ? 'none' : 'block');

		$('#nextPage').css('display', 'block'); //Mostro o botão avançar;

		if(arg == 'sem flag' || !Main.autoPlay)	return; //Caso o seguir seja sem flag, paro aqui

		//Se a função não for chamada da 'Player.enableNextPage', a navegação estiver desabilitada e Player.mostrarSeguir false, escondo botão;
		if(arg != 'end' && !Main.habilitarNavegacao && !Player.mostrarSeguir) $('#nextPage').css('display', 'none');  

		//Se a navegação estiver habilitada, ou a página atual ainda não visitada ou a função foi chamada pela 'Player.enableNextPage';
		if(Main.habilitarNavegacao || Player.currentPage < Player.maxPageVisited || arg == 'end') return; 

		//Aqui verfico se a legenda ja foi vista, se sim, mostro o seguir;
		for(var w = 0; w < Subtitle.sawSubtitles[Player.currentPage-1].length; w++){
			if($('#pageFrame')[0].contentWindow.exportRoot.currentFrame == Subtitle.sawSubtitles[Player.currentPage-1][w]){
				Player.mostrarSeguir = true;
				$('#nextPage').css('display', 'block'); 
				return
			}
		}

		//caso não foi vista
		Player.mostrarSeguir = false;	$('#nextPage').css('display', 'none');
	},

	//Mudar o 'display' dos botões de navegação
	changeNavDisplay: function (arg1){ 
		$('#prevPage').css('display', arg1); 
		$('#nextPage').css('display', arg1); 
	},

	//Descubro qual frame ir usando o botão voltar
	getCheckpoint: function (){
		Player.frameToGo = Player.pagesArray[Player.currentPage-1][ Player.pagesArray[Player.currentPage-1].length-1 ];
		Player.pagesArray[Player.currentPage-1].pop();
		$('#pageFrame')[0].contentWindow.exportRoot.gotoAndStop(Player.frameToGo);
	},

	//atualizo a tela e elementos necessarios 
	updatePage: function (arg1, arg2){
		var pageSource = course_structure[arg1-1][0]; //Page SRC
		Player.backOrOn = arg2; //Passo arg2 para uma var global

		$('#pageNavigation').css('display', 'none'); //Escondo as bolas de navegação

		if($('#courseMenu').css("display") == 'block') { Menu.workMenu(); }; //Se aberto, fecho o menu
		
		if( $('#pageFrame').attr('src') != 'pages/' + pageSource ){ //Se for chamado uma tela diferente da que esta
			if(arg2 == 'menu') for(var w = 0; w < Player.totalPages; w++){ Player.pagesArray[w] = [] }; //Se for acessada via menu, reseto os checkpoints

			$('#locution').attr('src', ''); //Reseto src da loc;
			$('#nextPage').css('display', 'none'); //Escondo o botão avançar;

			doContent = true; //Mudo a variavel para que o botão avançar navegue pelo conteudo, não pelas telas do curso;
			
			if(arg1 == 1){ //Se for a tela 1
				$('#prevPage').css('display', 'none');
			}else{
				$('#prevPage').css('display', 'block');
				Player.backContent = false; //Mudo a variavel para que o botão voltar navegue pelas telas do curso, não pelo conteudo
			};

			Subtitle.theAvatar = null; //Reseto personagem
			if( $('#subtitle').css('display') == 'block' || !Subtitle.showSubtitle) Subtitle.clearSubtitle(); //Se houver legenda, há retiro

			$('#pageFrame').attr('src', '_pages/' + pageSource); //Atualizo o iframe
			Player.showLoader(); //Mostro o loader
			Player.disableNextPage(); //Faço o botão avançar parar de piscar

			//trabalho com o location, Player.maxPagevisited e Player.currentPage
			Player.currentPage = arg1;
			if(Player.currentPage > Player.maxPageVisited) {
				Player.maxPageVisited = Player.currentPage;
			}else{
				if(!Main.habilitarNavegacao) Player.mostrarSeguir = true;
			}
			
			if(Lms.isOn) Lms.setValue('location');

			//Animação para o nome da tela
			$('#pageName').finish(); //Finalizo a animação antes de recomeçar
			$('#pageName').animate( {opacity: '0', left: arg2 == 'next' ? '-=10' : '+=10'}, 100, 
				function(){ 
					$('#pageName').css('left', arg2 == 'next' ? '+=20' : '-=20'); 
					$('#pageName').html('Tela ' + Player.currentPage + ' de ' + Player.totalPages + ' - ' + course_structure[Player.currentPage-1][1]);
					$('#pageName').animate( {opacity: '1', left: arg2 == 'next' ? '-=10' : '+=10'}, 200);
				}
			);

			if(Player.currentPage == Player.totalPages && Lms.isOn) Lms.setValue('status', 'completed'); //Se for ultima pagina seto completed
			Menu.updateMenuStatus(); //update menu
			Subtitle.getPageSubtitles(pageSource); //Recupero as legendas da tela
		};
	},

	showLoader: function (){ 
		$("#pageLoader").css('display', 'block'); 
	},
	hideLoader: function (){ 
		$("#pageLoader").css('display', 'none');
	},

	onFrameLoad: function (){
		//Se for a primeira tela ou navegação para frente, não busco o checkPoint;
		if(Player.pagesArray[Player.currentPage-1]){
			if(Player.backOrOn != 'next'){
				if(Player.pagesArray[Player.currentPage-1][ Player.pagesArray[Player.currentPage-1].length-1 ]){
					Player.getCheckpoint(); //Checo qual frame ir
					Player.backContent = true; //Mudo a variavel para que o botão voltar navegue pelas telas do curso, não pelo conteudo
				}

			}
		}
		Player.hideLoader();
	}
};
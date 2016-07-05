var Main = {
	 //Insira a note de corte do treinamento em porcentagem (0 ~ 100)
	minScore: 70,

	//Estilo do menu (pages, retratil, chapters)
	menuStyle: 'pages', 

	//Habilita/desabilita autoplay após a legenda (true - false | se false, o aluno controla por intermedio do seguir)
	autoPlay: false,  

	//habilita/desabilita navegação (true - false);
	habilitarNavegacao: true, 

	//inserir a cor (código hexadecimal) padrão do curso que irá ser aplicada nos detalhes do player;
	corDoCurso: "#00abe7",

	//O curso possui legenda?
	cursoComLegenda: false,

	//O curso possui locução?
	cursoComLocucao: false,

	isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
	courseLoaded: function (){ 
		$('#aberturaDiv').click(Player.startCourse); 
	}
}
export const modulos = [
    {
        id: 1,
        name: 'Módulo 1',
        description: 'Neste módulo, você irá ver um assunto que será informado durante as aulas, não se esqueça de fazer as provas',
        prof: 'Antônio Ambulante',
        timesEnd: 'XX/XX/XX',
        aulasTotal: 6,
        aulasFeitas: 0,
        provasTotal: 6,
        provasFeitas: 0,
        workCampoTotal: 2,
        workCampoFeitas: 0,
        status: 'start',
    },
    {
        id: 2,
        name: 'Módulo 2',
        description: 'Neste módulo, você irá ver um assunto que será informado durante as aulas, não se esqueça de fazer as provas',
        prof: 'Antônio Ambulante',
        timesEnd: 'XX/XX/XX',
        aulasTotal: 6,
        aulasFeitas: 0,
        provasTotal: 6,
        provasFeitas: 0,
        workCampoTotal: 2,
        workCampoFeitas: 0,
        status: 'start',
    },
    {
        id: 3,
        name: 'Módulo 3',
        description: 'Neste módulo, você irá ver um assunto que será informado durante as aulas, não se esqueça de fazer as provas',
        prof: 'Antônio Ambulante',
        timesEnd: 'XX/XX/XX',
        aulasTotal: 6,
        aulasFeitas: 0,
        provasTotal: 6,
        provasFeitas: 0,
        workCampoTotal: 2,
        workCampoFeitas: 0,
        status: 'start',
    },
]

export const moduloContent = [
    {
        week: "Semana 1",
        title: "Transtorno do Espectro do Autismo",
        date: "21/10/2024",
        content: [
            { type: "Aula", title: "Aula 1", duration: "60min", status: "completed", score: null, youtubeId: "VIDEO_ID_1", description: "Descrição da aula 1" },
            { type: "Teste", title: "Teste 1", duration: "30min", status: "completed", score: 90 },
            { type: "Ao Vivo", title: "Ao Vivo 1", duration: "60min", status: "blocked", youtubeId: "LIVE_VIDEO_ID", description: "Descrição da aula ao vivo" },
        ]
    },
    {
        week: "Semana 2",
        title: "Transtorno de Linguagem",
        date: "23/10/2024",
        content: [
        { type: "Aula", duration: "60min", status: "blocked", score: null, videoUrl: "https://www.youtube.com/watch?v=EXAMPLE2" },
        { type: "Prova", duration: "120min", status: "blocked", score: null },
        ],
    }
];


export const turmas = [
    {
        id: 1, 
        name: 'Turma A'
    },
    {
        id: 2, 
        name: 'Turma B'
    },
    {
        id: 3, 
        name: 'Turma C'
    },
    {
        id: 4, 
        name: 'Turma D'
    },
];

export const users = [
    {
        id: 1,
        name: 'Pedro Furtado',
        email: 'pedrofurtado@gmail.com',
        type: 3,
        isActive: true,
    },
    {
        id: 1,
        name: 'Vitor Sixel',
        email: 'v.vitor@gmail.com',
        type: 3,
        isActive: true,
    },
    {
        id: 1,
        name: 'João Pedro',
        email: 'jpjogador@gmail.com',
        type: 3,
        isActive: true,
    },
    {
        id: 1,
        name: 'Fernando Oliveira',
        email: 'fernandoo@gmail.com',
        type: 3,
        isActive: true,
    },
    {
        id: 1,
        name: 'Matheus Souza',
        email: 'matsouza@gmail.com',
        type: 3,
        isActive: true,
    },
]

export const professores = [
    {
        id: 1,
        name: 'Vincios Parrião',
        email: 'vinicios@gmail.com', 
    },
    {
        id: 1,
        name: 'Vitor Sixel',
        email: 'v.vitor@gmail.com',
    },
    {
        id: 1,
        name: 'João Pedro',
        email: 'jpjogador@gmail.com',
    },
    {
        id: 1,
        name: 'Fernando Oliveira',
        email: 'fernandoo@gmail.com',
    },
    {
        id: 1,
        name: 'Matheus Souza',
        email: 'matsouza@gmail.com',
    },
]

const optionsRastreios = [ 
    { id: 1, text: 'Nunca' }, 
    { id: 2, text: 'Algumas vezes' }, 
    { id: 3, text: 'Sempre' }, 
]

export const questsRestreioType1 = [
    {
        id: 1, 
        quest: 'Chora com frequência sem motivo aparente durante as aulas?',
        options: optionsRastreios
    },
    {
        id: 2, 
        quest: 'Facilmente distraído por estímulos alheios à tarefa que deve ser realizada?',
        options: optionsRastreios
    },
    {
        id: 3, 
        quest: 'Faz perguntas ao professor o tempo inteiro, chegando a atrapalhar a dinâmica da aula?',
        options: optionsRastreios    
    },
    {
        id: 4, 
        quest: 'Tem dificuldade em aguardar sua vez?',
        options: optionsRastreios    
    },
    {
        id: 5, 
        quest: 'Os materiais são geralmente desorganizados ou espalhados no chão?',
        options: optionsRastreios    
    },
    {
        id: 6, 
        quest: 'Se machuca com frequência, chegando a cair algumas vezes?',
        options: optionsRastreios    
    },
    {
        id: 7, 
        quest: 'Conversa muito com os coleguinhas, sempre tirando o foco da atividade proposta em sala?',
        options: optionsRastreios    
    },
    {
        id: 8, 
        quest: 'Sai do lugar o tempo inteiro, corre e/ou sobe em lugares inapropriados?',
        options: optionsRastreios    
    },
    {
        id: 9, 
        quest: 'Prefere ficar sozinho durante as atividades coletivas ou possui extrema dificuldade nas interações?',
        options: optionsRastreios    
    },
    {
        id: 10, 
        quest: 'Faz movimentos repetidos (com as mãos ou girar em torno de si)?',
        options: optionsRastreios    
    },
    {
        id: 11, 
        quest: 'Parece não escutar quando chamado pelo nome?',
        options: optionsRastreios    
    },
    {
        id: 12, 
        quest: 'Não mantem o contato visual durante os momentos de interação?',
        options: optionsRastreios    
    },
    {
        id: 13, 
        quest: 'Não demonstra emoções, geralmente alheio ao educador ou profissionais que possuam contato prolongado?',
        options: optionsRastreios    
    },
    {
        id: 14, 
        quest: 'Desconforto quando está em ambientes com barulhos e muitas pessoas?',
        options: optionsRastreios    
    },
    {
        id: 15, 
        quest: 'Empilha e/ou enfileira objetos?',
        options: optionsRastreios    
    },
    {
        id: 16, 
        quest: 'Comunica-se através de gestos',
        options: optionsRastreios    
    },
    {
        id: 17, 
        quest: 'Não reconhece letras?',
        options: optionsRastreios    
    },
    {
        id: 18, 
        quest: 'Não reconhece números?',
        options: optionsRastreios    
    },
    {
        id: 19, 
        quest: 'Não sabe contar até 5 ou 10?',
        options: optionsRastreios    
    },
    {
        id: 20, 
        quest: 'Não apresenta resposta emocional quando ouve um texto?',
        options: optionsRastreios    
    },
    {
        id: 21, 
        quest: 'Vocabulário na maioria das vezes incompreensível?',
        options: optionsRastreios    
    },
    {
        id: 22, 
        quest: 'A fala se assemelha a gagueira?',
        options: optionsRastreios    
    },
    {
        id: 23, 
        quest: 'Fala poucas palavras comparado aos seus pares?',
        options: optionsRastreios    
    },
    {
        id: 24, 
        quest: 'Forma poucas frases ou nenhuma?',
        options: optionsRastreios    
    },
    {
        id: 25, 
        quest: 'Dificuldade em aceitar as regras e ordens?',
        options: optionsRastreios    
    },
    {
        id: 26, 
        quest: 'Geralmente mais agressivo sem motivo aparente ou mantém irritabilidade mesmo sem estímulo?',
        options: optionsRastreios    
    },
    {
        id: 27, 
        quest: 'Dificuldade em manter atenção nas rodas de história ou atividades lúdicas?',
        options: optionsRastreios    
    },
    {
        id: 28, 
        quest: 'Vocabulário reduzido ou incompreensível?',
        options: optionsRastreios    
    },
    {
        id: 29, 
        quest: 'Tem pouco juízo para atividades de risco?',
        options: optionsRastreios    
    },
    {
        id: 30, 
        quest: 'Pede ajuda para realizar atividades pessoais simples (p. ex. vestir a roupa)?',
        options: optionsRastreios    
    },
    {
        id: 31, 
        quest: 'Aprende pouco por mais que observe os outros?',
        options: optionsRastreios    
    },
    {
        id: 32, 
        quest: 'Criança é geralmente manipulada pelos outros colegas?',
        options: optionsRastreios    
    },
]

export const questsRestreioType2 = [
    {
        id: 1, 
        quest: 'Criança pede para sair da sala por motivos diversos, mais de uma vez na mesma aula?',
        options: optionsRastreios    
    },
    {
        id: 2, 
        quest: 'Facilmente distraído por estímulos alheios à tarefa?',
        options: optionsRastreios    
    },
    {
        id: 3, 
        quest: 'Dá respostas precipitadas antes da pergunta ser completada?',
        options: optionsRastreios    
    },
    {
        id: 4, 
        quest: 'Tem dificuldade em aguardar sua vez?',
        options: optionsRastreios    
    },
    {
        id: 5, 
        quest: 'Apresenta esquecimento em atividades feitas diariamente ou realizadas com frequência?',
        options: optionsRastreios    
    },
    {
        id: 6, 
        quest: 'Deixa as atividades pela metade?',
        options: optionsRastreios    
    },
    {
        id: 7, 
        quest: 'Perde ou esquece os materiais escolares com frequência?',
        options: optionsRastreios    
    },
    {
        id: 8, 
        quest: 'Mantem conversa paralela durante as explicações?',
        options: optionsRastreios    
    },
    {
        id: 9, 
        quest: 'Prefere ficar sozinho durante as atividades coletivas ou não interage de maneira produtiva?',
        options: optionsRastreios    
    },
    {
        id: 10, 
        quest: 'Faz movimentos repetitivos (balança as mãos ou gira em torno de si)?',
        options: optionsRastreios    
    },
    {
        id: 11, 
        quest: 'Parece não escutar quando chamado pelo nome?',
        options: optionsRastreios    
    },
    {
        id: 12, 
        quest: 'Não mantém o contato visual durante os momentos de interação?',
        options: optionsRastreios    
    },
    {
        id: 13, 
        quest: 'Não demonstra emoções, geralmente alheio ao educador ou outros profissionais próximos?',
        options: optionsRastreios    
    },
    {
        id: 14, 
        quest: 'Desconforto quando está em ambientes com barulhos e muitas pessoas?',
        options: optionsRastreios    
    },
    {
        id: 15, 
        quest: 'Empilha e/ou enfileira objetos?',
        options: optionsRastreios    
    },
    {
        id: 16, 
        quest: 'Comunica-se através de gestos',
        options: optionsRastreios    
    },
    {
        id: 17, 
        quest: 'Apresenta dificuldades na leitura de palavras/textos simples?',
        options: optionsRastreios    
    },
    {
        id: 18, 
        quest: 'Dificuldade em fazer cálculos além do habitual para a idade?',
        options: optionsRastreios    
    },
    {
        id: 19, 
        quest: 'Não consegue interpretar completamente partes essenciais do texto lido ou ouvido?',
        options: optionsRastreios    
    },
    {
        id: 20, 
        quest: 'A escrita tem erros ortográficos ou pontuação, além do habitual para faixa etária?',
        options: optionsRastreios    
    },
    {
        id: 21, 
        quest: 'Vocabulário na maioria das vezes incompreensível?',
        options: optionsRastreios    
    },
    {
        id: 22, 
        quest: 'A fala se assemelha a gagueira?',
        options: optionsRastreios    
    },
    {
        id: 23, 
        quest: 'Fala poucas palavras comparado aos seus pares?',
        options: optionsRastreios    
    },
    {
        id: 24, 
        quest: 'Forma poucas frases ou nenhuma?',
        options: optionsRastreios    
    },
    {
        id: 25, 
        quest: 'Dificuldade em aceitar as regras e ordens?',
        options: optionsRastreios    
    },
    {
        id: 26, 
        quest: 'Geralmente mais agressivo com os colegas e educador sem motivo aparente?',
        options: optionsRastreios    
    },
    {
        id: 27, 
        quest: 'Gosta de incomodar os outros ou se satisfaz com atitudes desconfortáveis para os colegas?',
        options: optionsRastreios    
    },
    {
        id: 28, 
        quest: 'Discute com o professor e outros adultos?',
        options: optionsRastreios    
    },
    {
        id: 29, 
        quest: 'Tem pouco juízo para atividades de risco?',
        options: optionsRastreios    
    },
    {
        id: 30, 
        quest: 'Pede ajuda para realizar atividades pessoais simples (amarrar o sapato...)?',
        options: optionsRastreios    
    },
    {
        id: 31, 
        quest: 'Aprende pouco por mais que observe os outros?',
        options: optionsRastreios    
    },
    {
        id: 32, 
        quest: 'Geralmente manipulada pelos outros colegas ou não se manifesta diante da vontade dos outros?',
        options: optionsRastreios    
    },
]

export const questsRestreioType3 = [
    {
        id: 1, 
        quest: 'O estudante se mantém inquieto, sai excessivamente ou dá frequentes desculpas para estar fora da sala de aula?',
        options: optionsRastreios    
    },
    {
        id: 2, 
        quest: 'Facilmente distraído por estímulos alheios ao tema abordado ou comando direcionado?',
        options: optionsRastreios    
    },
    {
        id: 3, 
        quest: 'Dá respostas precipitadas antes da pergunta ser completada?',
        options: optionsRastreios    
    },
    {
        id: 4, 
        quest: 'Tem dificuldade em aguardar sua vez?',
        options: optionsRastreios    
    },
    {
        id: 5, 
        quest: 'Apresenta esquecimento em atividades feitas diariamente?',
        options: optionsRastreios    
    },
    {
        id: 6, 
        quest: 'Deixa as atividades pela metade? ',
        options: optionsRastreios    
    },
    {
        id: 7, 
        quest: 'Perde ou esquece itens necessários para a realização de suas atividades, dentro ou fora de sala? ',
        options: optionsRastreios    
    },
    {
        id: 8, 
        quest: 'Mantém conversa paralela durante as explicações? ',
        options: optionsRastreios    
    },
    {
        id: 9, 
        quest: 'Possui dificuldades de desempenho ou relação interpessoal nas atividades em grupo?',
        options: optionsRastreios    
    },
    {
        id: 10, 
        quest: 'Apresenta movimentos repetitivos como pernas inquietas ou bater de lápis, canetas?',
        options: optionsRastreios    
    },
    {
        id: 11, 
        quest: 'Possui dificuldade em direcionar a atenção quando é chamado em ambiente com outros estímulos?',
        options: optionsRastreios    
    },
    {
        id: 12, 
        quest: 'Não mantem o contato visual durante os momentos de interação?',
        options: optionsRastreios    
    },
    {
        id: 13, 
        quest: 'Não demonstra emoções, geralmente alheio ao educador ou colegas?',
        options: optionsRastreios    
    },
    {
        id: 14, 
        quest: 'Apresenta desconforto quando está em ambientes com barulho excessivo e muitas pessoas?',
        options: optionsRastreios    
    },
    {
        id: 15, 
        quest: 'Apresenta padrões rígidos ou repetitivos de comportamento?',
        options: optionsRastreios    
    },
    {
        id: 16, 
        quest: 'Comunica-se através de gestos',
        options: optionsRastreios    
    },
    {
        id: 17, 
        quest: 'Apresenta dificuldades na leitura de palavras/textos simples?',
        options: optionsRastreios    
    },
    {
        id: 18, 
        quest: 'Dificuldade em fazer cálculos além do habitual para a idade?',
        options: optionsRastreios    
    },
    {
        id: 19, 
        quest: 'Não consegue interpretar completamente partes essenciais do texto lido ou ouvido?',
        options: optionsRastreios    
    },
    {
        id: 20, 
        quest: 'A escrita apresenta erros ortográficos ou pontuação, além do habitual para faixa etária?',
        options: optionsRastreios    
    },
    {
        id: 21, 
        quest: 'Vocabulário na maioria das vezes incompreensível?',
        options: optionsRastreios    
    },
    {
        id: 22, 
        quest: 'A fala se assemelha a gagueira?',
        options: optionsRastreios    
    },
    {
        id: 23, 
        quest: 'Fala poucas palavras comparado aos seus pares?',
        options: optionsRastreios    
    },
    {
        id: 24, 
        quest: 'Forma poucas frases ou nenhuma?',
        options: optionsRastreios    
    },
    {
        id: 25, 
        quest: 'Dificuldade em aceitar as regras e ordens?',
        options: optionsRastreios    
    },
    {
        id: 26, 
        quest: 'Geralmente mais agressivo com os colegas e educador sem motivo aparente?',
        options: optionsRastreios    
    },
    {
        id: 27, 
        quest: 'Gosta de incomodar os colegas e fica feliz por isso?',
        options: optionsRastreios    
    },
    {
        id: 28, 
        quest: 'Discute com o professor e outros adultos? ',
        options: optionsRastreios    
    },
    {
        id: 29, 
        quest: 'Tem pouco juízo para atividades de risco?',
        options: optionsRastreios    
    },
    {
        id: 30, 
        quest: 'Pede ou precisa ajuda para realizar atividades pessoais simples (amarrar o sapato...)?',
        options: optionsRastreios    
    },
    {
        id: 31, 
        quest: 'Aprende pouco por mais que observe os outros?',
        options: optionsRastreios    
    },
    {
        id: 32, 
        quest: 'Geralmente manipulada pelos outros colegas?',
        options: optionsRastreios    
    },
]


export const modulos_opcao_2 = [
    {
        id: 1,
        name: 'Semana 1',
        professor: 'Fernando Felicio',
        description: 'Essa é a descrição do módulo 1',
        validade: '10/12/2024',
    },
    {
        id: 2,
        name: 'Semana 2',
        professor: 'Marcelo Oliveira',
        description: 'Essa é a descrição do módulo 2',
        validade: '10/12/2024',
    },
]

export const conteudo = [
    {
        id: 1,
        moduloId: 1,
        name: 'Conteudo 1',
    },
    {
        id: 2,
        name: 'Conteudo 2',
        moduloId: 1,
    },
    {
        id: 3,
        name: 'Conteudo 1',
        moduloId: 2,
    },
]

export const aulas = [
    {
        id: 1,
        conteudoId: 1,
        name: 'Aula 1',
        description: 'Sua Descrição da aula 1',
        videoUrl: 'https://youtu.be/32gXLvKklPQ?si=jVOmGE7nzuUxayLr',
        material: [
            {id: 1, arq: 'arquivo_1.pdf'},
            {id: 2, arq: 'arquivo_2.pdf'},
        ]
    },
    {
        id: 2,
        conteudoId: 2,
        name: 'Aula 2',
        description: 'Sua Descrição da aula 2',
        videoUrl: 'https://youtu.be/32gXLvKklPQ?si=jVOmGE7nzuUxayLr',
        material: [
            {id: 1, arq: 'arquivo_1.pdf'},
            {id: 2, arq: 'arquivo_2.pdf'},
        ]
    },
    {
        id: 3,
        conteudoId: 3,
        name: 'Aula 3',
        description: 'Sua Descrição da aula 3',
        videoUrl: 'https://youtu.be/32gXLvKklPQ?si=jVOmGE7nzuUxayLr',
        material: [
            {id: 1, arq: 'arquivo_1.pdf'},
            {id: 2, arq: 'arquivo_2.pdf'},
        ]
    }
]

export const progressAulas = [
    {
        userId: 1,         
        aulaId: 1,         
        status: 'end',     
    },
    {
        userId: 1,
        aulaId: 2,
        status: 'start',
    },
    {
        userId: 2,
        aulaId: 1,
        status: 'start',
    },
];

export const provas = [
    {
        id: 1,
        conteudoId: 1,
        title: 'Prova 1',
        description: 'Sua Descrição da prova 1',
        config: [
            {id: 1, toggle: false, text: 'Ordenar as questões de forma aleatória'},
            {id: 2, toggle: false, text: 'Ordenar as opções de respostas de forma aleatória'},
            {id: 3, toggle: false, text: 'Valor das questões distribuídos igualitariamente'},
            {id: 4, toggle: false, text: 'Questões da prova aleatórias para cada tentativa'},
        ],
        questNumber: 10,
        quests: [
            {
                id: 1,
                quest: 'Título da pergunta 1',
                responde: [
                    { id: 1, text: 'Resposta 1 da pergunta 1', value: true },
                    { id: 2, text: 'Resposta 2 da pergunta 1', value: true },
                    { id: 3, text: 'Resposta 3 da pergunta 1', value: true },
                    { id: 4, text: 'Resposta 4 da pergunta 1', value: true },
                ]
            },
            {
                id: 2,
                quest: 'Título da pergunta 2',
                responde: [
                    { id: 1, text: 'Resposta 1 da pergunta 2', value: true },
                    { id: 2, text: 'Resposta 2 da pergunta 2', value: true },
                    { id: 3, text: 'Resposta 3 da pergunta 2', value: true },
                    { id: 4, text: 'Resposta 4 da pergunta 2', value: true },
                ]
            },
            {
                id: 3,
                quest: 'Título da pergunta 3',
                responde: [
                    { id: 1, text: 'Resposta 1 da pergunta 3', value: true },
                    { id: 2, text: 'Resposta 2 da pergunta 3', value: true },
                    { id: 3, text: 'Resposta 3 da pergunta 3', value: true },
                    { id: 4, text: 'Resposta 4 da pergunta 3', value: true },
                ]
            },
        ]
    },
    {
        id: 2,
        conteudoId: 2,
        title: 'Prova 2',
        description: 'Sua Descrição da prova 2',
        config: [
            {id: 1, toggle: false, text: 'Ordenar as questões de forma aleatória'},
            {id: 2, toggle: false, text: 'Ordenar as opções de respostas de forma aleatória'},
            {id: 3, toggle: false, text: 'Valor das questões distribuídos igualitariamente'},
            {id: 4, toggle: false, text: 'Questões da prova aleatórias para cada tentativa'},
        ],
        questNumber: 10,
        quests: [
            {
                id: 1,
                quest: 'Título da pergunta 1',
                responde: [
                    { id: 1, text: 'Resposta 1 da pergunta 1', value: true },
                    { id: 2, text: 'Resposta 2 da pergunta 1', value: true },
                    { id: 3, text: 'Resposta 3 da pergunta 1', value: true },
                    { id: 4, text: 'Resposta 4 da pergunta 1', value: true },
                ]
            },
            {
                id: 2,
                quest: 'Título da pergunta 2',
                responde: [
                    { id: 1, text: 'Resposta 1 da pergunta 2', value: true },
                    { id: 2, text: 'Resposta 2 da pergunta 2', value: true },
                    { id: 3, text: 'Resposta 3 da pergunta 2', value: true },
                    { id: 4, text: 'Resposta 4 da pergunta 2', value: true },
                ]
            },
            {
                id: 3,
                quest: 'Título da pergunta 3',
                responde: [
                    { id: 1, text: 'Resposta 1 da pergunta 3', value: true },
                    { id: 2, text: 'Resposta 2 da pergunta 3', value: true },
                    { id: 3, text: 'Resposta 3 da pergunta 3', value: true },
                    { id: 4, text: 'Resposta 4 da pergunta 3', value: true },
                ]
            },
        ]
    },
    {
        id: 2,
        conteudoId: 3,
        title: 'Prova 2',
        description: 'Sua Descrição da prova 2',
        config: [
            {id: 1, toggle: false, text: 'Ordenar as questões de forma aleatória'},
            {id: 2, toggle: false, text: 'Ordenar as opções de respostas de forma aleatória'},
            {id: 3, toggle: false, text: 'Valor das questões distribuídos igualitariamente'},
            {id: 4, toggle: false, text: 'Questões da prova aleatórias para cada tentativa'},
        ],
        questNumber: 10,
        quests: [
            {
                id: 1,
                quest: 'Título da pergunta 1',
                responde: [
                    { id: 1, text: 'Resposta 1 da pergunta 1', value: true },
                    { id: 2, text: 'Resposta 2 da pergunta 1', value: true },
                    { id: 3, text: 'Resposta 3 da pergunta 1', value: true },
                    { id: 4, text: 'Resposta 4 da pergunta 1', value: true },
                ]
            },
            {
                id: 2,
                quest: 'Título da pergunta 2',
                responde: [
                    { id: 1, text: 'Resposta 1 da pergunta 2', value: true },
                    { id: 2, text: 'Resposta 2 da pergunta 2', value: true },
                    { id: 3, text: 'Resposta 3 da pergunta 2', value: true },
                    { id: 4, text: 'Resposta 4 da pergunta 2', value: true },
                ]
            },
            {
                id: 3,
                quest: 'Título da pergunta 3',
                responde: [
                    { id: 1, text: 'Resposta 1 da pergunta 3', value: true },
                    { id: 2, text: 'Resposta 2 da pergunta 3', value: true },
                    { id: 3, text: 'Resposta 3 da pergunta 3', value: true },
                    { id: 4, text: 'Resposta 4 da pergunta 3', value: true },
                ]
            },
        ]
    }
]

export const progressProvas = [
    {
        userId: 1,         
        provaId: 1,         
        status: 'end',     
    },
    {
        userId: 1,
        provaId: 2,
        status: 'start',
    },
    {
        userId: 2,
        provaId: 1,
        status: 'block',
    },
];
/*
import PropTypes from 'prop-types';
import './ComponentLimitado.css'
import InputSend from '../InputSend/InputSend';
import { useEffect, useState } from 'react';
import InputDate from '../InputDate/InputDate';
import ButtonBold from '../ButtonBold/ButtonBold';
import DropDown from '../DropDown/DropDown';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { firestore, storage } from '../../services/firebaseConfig';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import InputText from '../InputText/InputText';

function ComponentLimitado() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [optionsProfessor, setOptionsProfessor] = useState([]);
    const [professor, setProfessor] = useState('');
    const [validade, setValidade] = useState('');
    const [liberacaoModulo, setLiberacaoModulo] = useState('')
    const [loading, setLoading] = useState(true); 

    const fetchUsersFromFirestore = async () => {
        try {
            const q = query(collection(firestore, 'users'), where("type", "in", [1, 2])); 
            const querySnapshot = await getDocs(q);
            const usersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            console.log('usersList: ', usersList)
            setOptionsProfessor(usersList);
        } catch (error) {
            console.error("Erro ao buscar usuários:", error);
        } finally {
            setLoading(false); 
        }
    };

    useEffect(() => {
        fetchUsersFromFirestore();
    }, []);

    const getName = (newName) => {
        setName(newName);
    };
    const getDescription = (newDesc) => {
        setDescription(newDesc);
    };
    const getProfessor = (option) => {
        if (option.id) {
            setProfessor(option.id); 
        } else {
            setProfessor('Selecione');
        }
    };

    const salvarModulo = async (send) => {
        if (send) {
            try {
                if(name === '' || description === '' || professor === '' || validade === ''){
                    alert('Preencha os campos de Modulo')
                    return
                }
                await addDoc(collection(firestore, 'modulos'), {
                    name: name,
                    description: description,
                    professorId: professor,
                    liberacao: liberacaoModulo,
                    validade: validade,
                    createdAt: new Date(),

                });
                alert("Módulo salvo com sucesso!");
                setName('')
                setDescription('')
                setProfessor('')
                setLiberacaoModulo('')
                setValidade('')
            } catch (error) {
                console.error("Erro ao salvar módulo:", error);
            }
        }
    };

    const renderCreateModulo = () => {
        return (
            <div>
                <h1>Adicionar Módulo</h1>
                <div style={{alignItems: 'start', display: 'flex', flexDirection: 'column', width: '100%', marginTop: 20}}>
                <InputSend title='Nome' placeH='' onSearchChange={getName} type='text' />
                <InputSend title='Descrição' placeH='' onSearchChange={getDescription} type='text' />
                
                {loading ? (
                    <p>Carregando professores...</p> 
                ) : (
                    <DropDown
                        title='Professor'
                        type='Selecione'
                        options={optionsProfessor}
                        onTurmaChange={getProfessor}
                    />
                )}
                <InputDate title='Data Liberação' placeH='Selecione' onSearchChange={setLiberacaoModulo} />
                <InputDate title='Validade' placeH='Selecione' onSearchChange={setValidade} />
                </div>
                <ButtonBold title='Salvar Módulo' icon action={() => salvarModulo(true)} />
            </div>
        );
    };










    const [optionsModulos, setOptionsModulos] = useState([])
    const [nameConteudo, setNameConteudo] = useState('');
    const [modulo, setModulo] = useState('')
    const [liberacao, setliberacao] = useState('');

    const fetchModulosFromFirestore = async () => {
        try {
            const q = query(collection(firestore, 'modulos')); 
            const querySnapshot = await getDocs(q);
            const modulosList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            console.log('modulosList: ', modulosList);
            setOptionsModulos(modulosList); 
        } catch (error) {
            console.error("Erro ao buscar módulos:", error); 
        } finally {
            setLoading(false); 
        }
    };

    useEffect(() => {
        fetchModulosFromFirestore();
    }, []);

    const getNameConteudo = (newName) => {
        setNameConteudo(newName);
    };

    const getModulo = (option) => {
        if (option.id) {
            setModulo(option.id); 
        } else {
            setModulo('Selecione');
        }
    };

    const salvarConteudo = async (send) => {
        if (send) {
            try {
                if(nameConteudo === '' || modulo === ''){
                    alert('Preencha os campos de Conteudo')
                    return
                }
                await addDoc(collection(firestore, 'conteudo'), {
                    name: nameConteudo,
                    moduloId: modulo,
                    openDate: liberacao,
                    createdAt: new Date(),
                });
                alert("Conetudo salvo com sucesso!");
                setNameConteudo('')
                setModulo('')
            } catch (error) {
                console.error("Erro ao salvar conteudo:", error);
            }
        }
    };

    const renderCreateConteudo = () => {
        return (
            <div>
                <h1>Adicionar Conteudo</h1>
                <div style={{alignItems: 'start', display: 'flex', flexDirection: 'column', width: '100%', marginTop: 20}}>
                {loading ? (
                    <p>Carregando modulos...</p> 
                ) : (
                    <DropDown
                        title='Módulo'
                        type='Selecione'
                        options={optionsModulos}
                        onTurmaChange={getModulo}
                    />
                )}
                <InputSend title='Nome' placeH='' onSearchChange={getNameConteudo} type='text' />
                <InputDate title='Data Liberação' placeH='Selecione' onSearchChange={setliberacao} />
                </div>
                <ButtonBold title='Salvar Conteudo' icon action={() => salvarConteudo(true)} />
            </div>
        );
    };







    const [optionsConteudo, setOptionsConteudo] = useState([])
    const [nameAula, setNameAula] = useState('');
    const [conteudo, setConteudo] = useState('')
    const [descriptionAula, setDescriptionAula] = useState('')
    const [videoUrl, setVideoUrl] = useState('')

    const fetchConteudosFromFirestore = async () => {
        try {
            const q = query(collection(firestore, 'conteudo'));  
            const querySnapshot = await getDocs(q);
            const conteudosList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));  
            console.log('ConteudoList: ', conteudosList);  
            setOptionsConteudo(conteudosList);  
        } catch (error) {
            console.error("Erro ao buscar conteúdos:", error); 
        } finally {
            setLoading(false); 
        }
    };

    useEffect(() => {
        fetchConteudosFromFirestore();
    }, []);

    const getNameAula = (newName) => {
        setNameAula(newName);
    };

    const getConteudo = (option) => {
        if (option.id) {
            setConteudo(option.id); 
        } else {
            setConteudo('Selecione');
        }
    };

    const getDescriptionAula = (newDesc) => {
        setDescriptionAula(newDesc);
    };

    const getVideoUrl = (newUrl) => {
        setVideoUrl(newUrl)
    }

    const salvarAula = async (send) => {
        if (send) {
            try {
                if(nameAula === '' || conteudo === '' || descriptionAula === '' || videoUrl === ''){
                    alert('Preencha os campos de Aula')
                    return
                }
                await addDoc(collection(firestore, 'aulas'), {
                    name: nameAula,
                    conteudoId: conteudo,
                    description: descriptionAula,
                    videoUrl: videoUrl,
                    type: 'aula',
                    createdAt: new Date(),
                });
                alert("Aula salvo com sucesso!");
            } catch (error) {
                console.error("Erro ao salvar Aula:", error);
            }
        }
    };

    const renderCreateAula = () => {
        return (
            <div>
                <h1>Adicionar Aula</h1>
                <div style={{alignItems: 'start', display: 'flex', flexDirection: 'column', width: '100%', marginTop: 20}}>
                {loading ? (
                    <p>Carregando Conteudos...</p> 
                ) : (
                    <DropDown
                        title='Conteudo'
                        type='Selecione'
                        options={optionsConteudo}
                        onTurmaChange={getConteudo}
                    />
                )}
                <InputSend title='Nome' placeH='' onSearchChange={getNameAula} type='text' />
                <InputSend title='Descrição' placeH='' onSearchChange={getDescriptionAula} type='text' />
                <InputSend title='URL do video' placeH='' onSearchChange={getVideoUrl} type='text' />
                </div>
                <ButtonBold title='Salvar Aula' icon action={() => salvarAula(true)} />
            </div>
        );
    };







   
    const [nameProva, setNameProva] = useState('');
    const [descriptionProva, setDescriptionProva] = useState('');
    const [questoes, setQuestoes] = useState([{ pergunta: '', respostas: [{ texto: '', correta: false }]}]);

    useEffect(() => {
        fetchConteudosFromFirestore();
    }, []);

    const getNameProva = (newName) => {
        setNameProva(newName);
    };

    const getDescriptionProva = (newDesc) => {
        setDescriptionProva(newDesc);
    };

    const adicionarPergunta = () => {
        if (questoes.some(questao => questao.pergunta.trim() === '')) {
            alert('Preencha a pergunta antes de adicionar uma nova.');
            return;
        }
    
        setQuestoes([
            ...questoes,
            { pergunta: '', respostas: [{ texto: '', correta: false }] }
        ]);
    };

    const onSearchChangePergunta = (newPergunta, index) => {
        const updatedQuestoes = [...questoes];
        updatedQuestoes[index].pergunta = newPergunta;
        setQuestoes(updatedQuestoes);
    };
    
    const onSearchChangeResposta = (newResposta, questaoIndex, respostaIndex) => {
        const updatedQuestoes = [...questoes];
        updatedQuestoes[questaoIndex].respostas[respostaIndex].texto = newResposta;
        setQuestoes(updatedQuestoes);
    };

    const adicionarResposta = (questaoIndex) => {
        const updatedQuestoes = [...questoes];
        const questaoAtual = updatedQuestoes[questaoIndex];
    
        if (questaoAtual.respostas.some(resposta => resposta.texto.trim() === '')) {
            alert('Preencha todos os campos de resposta antes de adicionar uma nova.');
            return;
        }
    
        questaoAtual.respostas.push({ texto: '', correta: false });
        setQuestoes(updatedQuestoes);
    };

    const removerResposta = (questaoIndex, respostaIndex) => {
        const updatedQuestoes = [...questoes];
        updatedQuestoes[questaoIndex].respostas = updatedQuestoes[questaoIndex].respostas.filter((_, i) => i !== respostaIndex);
        setQuestoes(updatedQuestoes);
    };

    const marcarRespostaCorreta = (questaoIndex, respostaIndex) => {
        const updatedQuestoes = [...questoes];
        updatedQuestoes[questaoIndex].respostas = updatedQuestoes[questaoIndex].respostas.map((resposta, i) => ({
            ...resposta,
            correta: i === respostaIndex
        }));
        setQuestoes(updatedQuestoes);
    };

    const salvarProva = async (send) => {
        if (send) {
            try {
                if (nameProva === '' || conteudo === '' || descriptionProva === '') {
                    alert('Preencha os campos da prova e adicione ao menos uma resposta');
                    return;
                }
    
                const questsArray = questoes
                    .filter((questao) => questao.pergunta.trim() !== '')  
                    .map((questao) => {
                        const respostasValidas = questao.respostas.filter(resposta => resposta.texto.trim() !== ''); 
                        
                        if (respostasValidas.length === 0) {
                            return null;
                        }
    
                        return {
                            quest: questao.pergunta,
                            responses: respostasValidas.map((resposta) => ({
                                text: resposta.texto,
                                value: resposta.correta,
                            })),
                        };
                    })
                    .filter(questao => questao !== null);  
    
                if (questsArray.length === 0) {
                    alert('Por favor, adicione ao menos uma pergunta e uma resposta válida antes de salvar.');
                    return;
                }
    
                await addDoc(collection(firestore, 'provas'), {
                    name: nameProva,
                    conteudoId: conteudo,
                    description: descriptionProva,
                    quests: questsArray,
                    type: 'prova',
                    createdAt: new Date(),
                });
    
                alert("Prova salva com sucesso!");
    
                setNameProva('');
                setDescriptionProva('');
                setQuestoes([{
                    pergunta: '',
                    respostas: [{ texto: '', correta: false }]  
                }]);
    
            } catch (error) {
                console.error("Erro ao salvar prova:", error);
                alert("Ocorreu um erro ao salvar a prova. Tente novamente.");
            }
        }
    };
    
    const renderCreateProva = () => {
        return (
            <div>
                <h1>Adicionar Prova</h1>
                <div style={{ alignItems: 'start', display: 'flex', flexDirection: 'column', width: '100%', marginTop: 20 }}>
                    <InputSend title='Nome' placeH='' onSearchChange={getNameProva} type='text' />
                    <InputSend title='Descrição' placeH='' onSearchChange={getDescriptionProva} type='text' />
                    {loading ? (
                        <p>Carregando Conteudos...</p> 
                    ) : (
                        <DropDown
                            title='Conteudo'
                            type='Selecione'
                            options={optionsConteudo}
                            onTurmaChange={getConteudo}
                        />
                    )}
                
                    <h2>Questões da Prova</h2>
                    {questoes.map((questao, questaoIndex) => (
                        <div key={questaoIndex} className='divPergunta'>
                            <h4>Pergunta</h4>
                            <InputSend
                                title='Pergunta'
                                placeH=''
                                value={questao.pergunta}
                                onSearchChange={(newPergunta) => onSearchChangePergunta(newPergunta, questaoIndex)}
                                type='text'
                            />
                            <h4>Respostas</h4>
                            {questao.respostas.map((resposta, respostaIndex) => (
                                <div key={respostaIndex} style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                                    <InputSend
                                        title={`Resposta ${respostaIndex + 1}`}
                                        placeH=''
                                        value={resposta.texto}
                                        onSearchChange={(newResposta) => onSearchChangeResposta(newResposta, questaoIndex, respostaIndex)}
                                        type='text'
                                    />
                                    <div onClick={() => marcarRespostaCorreta(questaoIndex, respostaIndex)} className='divCircle'>
                                        {resposta.correta && <div className='divBall'></div>}
                                    </div>
                                    <p>Resposta Correta</p>
                                    <button onClick={() => removerResposta(questaoIndex, respostaIndex)}>
                                        Excluir Resposta
                                    </button>
                                </div>
                            ))}
                            <ButtonBold title='Adicionar resposta' icon action={() => adicionarResposta(questaoIndex)} />
                        </div>
                    ))}
                    <ButtonBold title='Adicionar Pergunta' icon action={adicionarPergunta} />
                </div>
                <ButtonBold title='Salvar Prova' icon action={() => salvarProva(true)} />
            </div>
        );
    };












    const [descriptionStoryTelling, setDescriptionStoryTelling] = useState('');
    const [nameStory, setNameStory] = useState('');
    const [pdfFile, setPdfFile] = useState(null);

    const getNameStory = (newName) => {
        setNameStory(newName);
    };


    const getDescriptionStoryTelling = (event) => {
        setDescriptionStoryTelling(event.target.value);
    };

    const salvarStoryTelling = async (send) => {
        if (send) {
            try {
                if (conteudo === '' || descriptionStoryTelling === '' || nameStory ===  '') {
                    alert('Preencha os campos da story e adicione ao menos uma resposta');
                    return;
                }
                
                if (!pdfFile) {
                    alert('Por favor, adicione um arquivo PDF.');
                    return;
                }
    
                const storageRef = ref(storage, `pdfs/${pdfFile.name}`);
                const uploadTask = uploadBytesResumable(storageRef, pdfFile);
    
                uploadTask.on(
                    'state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log(`Progresso: ${progress}%`);
                    },
                    (error) => {
                        console.error("Erro ao fazer upload do PDF:", error);
                        alert("Erro ao carregar o PDF. Tente novamente.");
                    },
                    async () => {
                        const pdfUrl = await getDownloadURL(uploadTask.snapshot.ref);
    
                        const storyData = {
                            conteudoId: conteudo,
                            name: nameStory,
                            description: descriptionStoryTelling,
                            pdfUrl, 
                            type: 'storyTelling',
                            createdAt: new Date(),
                        };
    
                        await addDoc(collection(firestore, 'provas'), storyData);
    
                        alert("StoryTelling salvo com sucesso!");
                    }
                );
            } catch (error) {
                console.error("Erro ao salvar Story:", error);
                alert("Ocorreu um erro ao salvar a Story. Tente novamente.");
            }
        }
    };
    
    const renderCreateStorytelling = () => {
        return (
            <div>
                <h1>Adicionar StoryTelling</h1>
                <div style={{ alignItems: 'start', display: 'flex', flexDirection: 'column', width: '100%', marginTop: 20 }}>
                    <InputSend title='Nome' placeH='' onSearchChange={getNameStory} type='text' />
                    <label htmlFor="descricao">Descrição</label>
                    <textarea
                        id="descricao"
                        value={descriptionStoryTelling}
                        onChange={getDescriptionStoryTelling}
                    />
                    {loading ? (
                        <p>Carregando Conteudos...</p> 
                    ) : (
                        <DropDown
                            title='Conteudo'
                            type='Selecione'
                            options={optionsConteudo}
                            onTurmaChange={getConteudo}
                        />
                    )}

                    
                <input 
                    type="file" 
                    accept=".pdf" 
                    onChange={(e) => setPdfFile(e.target.files[0])} 
                />
                    
                </div>
                <ButtonBold title='Salvar StoryTelling' icon action={() => salvarStoryTelling(true)} />
            </div>
        );
    };


    const [nameGame, setNameGame] = useState('');
    const [descriptionGame, setDescriptionGame] = useState('')
    const [linkGame,  setLinkGame] = useState('')

    const getNameGame = (newName) => {
        setNameGame(newName);
    };


    const getDescriptionGame = (event) => {
        setDescriptionGame(event.target.value);
    };

    const getLinkGame = (newLink) => {
        console.log("Link recebido:", newLink);
        setLinkGame(newLink);
    };
    

    const salvarGame = async (send) => {
        if (send) {
            try {
                if (nameGame === '' || descriptionGame === '' || linkGame === '') {
                    alert('Preencha os campos de Gamificação');
                    return;
                }
                const formattedDescription = descriptionGame.replace(/\n/g, '<br>');
                console.log("Dados que serão salvos:", { nameGame, description: formattedDescription, link: linkGame });
                
                await addDoc(collection(firestore, 'aulas'), {
                    name: nameGame,
                    conteudoId: conteudo,
                    description: formattedDescription,
                    type: 'game',
                    createdAt: new Date(),
                    link: linkGame,
                });
                
                alert("Gamificação salva com sucesso!");
            } catch (error) {
                console.error("Erro ao salvar Aula:", error);
            }
        }
    };
    

    const renderCreateGame = () => {
        return (
            <div>
                <h1>Adicionar Gameficação</h1>
                <div style={{alignItems: 'start', display: 'flex', flexDirection: 'column', width: '100%', marginTop: 20}}>
                {loading ? (
                    <p>Carregando Conteudos...</p> 
                ) : (
                    <DropDown
                        title='Conteudo'
                        type='Selecione'
                        options={optionsConteudo}
                        onTurmaChange={getConteudo}
                    />
                )}
                <InputSend title='Nome' placeH='' onSearchChange={getNameGame} type='text' />
                <label htmlFor="descricao">Descrição</label>
                    <textarea
                        id="descricao"
                        value={descriptionGame}
                        onChange={getDescriptionGame}
                    />
                    <InputSend title='Link do Game'  placeH='' onSearchChange={getLinkGame} type='text' />

                </div>
                <ButtonBold title='Salvar Aula' icon action={() => salvarGame(true)} />
            </div>
        );
    };








    const [searchTerm, setSearchTerm] = useState('');
    const [alunos, setAlunos] = useState([]);

    const handleSearchChange = (newSearchTerm) => {
        setSearchTerm(newSearchTerm);
    };

    const removeAccentsAndSpecialChars = (text) => {
        return text
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[-\s]/g, '');
    };

    const fetchMatriculas = async () => {
        try {
            const querySnapshot = await getDocs(collection(firestore, 'alunos'));

            const alunosList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setAlunos(alunosList);
            console.log("Alunos carregados com sucesso:", alunosList);
        } catch (error) {
            console.error("Erro ao carregar os alunos:", error);
        }
    };

    useEffect(() => {
        fetchMatriculas();
    }, []);

    const filtered = alunos.filter(a => {
        const lowerCaseSearchTerm = removeAccentsAndSpecialChars(searchTerm).toLowerCase();
        const alunoName = removeAccentsAndSpecialChars(a.name || '').toLowerCase();
        const alunoMatricula = removeAccentsAndSpecialChars(a.matricula || '').toLowerCase();

        return alunoName.includes(lowerCaseSearchTerm) || alunoMatricula.includes(lowerCaseSearchTerm);
    });

    // Contar duplicatas de `name` e `matricula`
    const nameCounts = {};
    const matriculaCounts = {};

    filtered.forEach(aluno => {
        const normalizedAlunoName = removeAccentsAndSpecialChars(aluno.name || '').toLowerCase();
        const normalizedAlunoMatricula = removeAccentsAndSpecialChars(aluno.matricula || '').toLowerCase();

        nameCounts[normalizedAlunoName] = (nameCounts[normalizedAlunoName] || 0) + 1;
        matriculaCounts[normalizedAlunoMatricula] = (matriculaCounts[normalizedAlunoMatricula] || 0) + 1;
    });

    const renderBuscarMatricula = () => {
        return (
            <div>
                <h1>Buscar Matrícula</h1>
                <div style={{ alignItems: 'start', display: 'flex', flexDirection: 'column', width: '100%', marginTop: 20 }}>
                    <InputText title='Pesquisa na tabela' placeH='Matrícula' onSearchChange={handleSearchChange} />
                </div>

                <div>
                    {filtered.map(aluno => {
                        const normalizedAlunoName = removeAccentsAndSpecialChars(aluno.name || '').toLowerCase();
                        const normalizedAlunoMatricula = removeAccentsAndSpecialChars(aluno.matricula || '').toLowerCase();

                        // Aplicar cor vermelha para itens duplicados
                        const nameStyle = nameCounts[normalizedAlunoName] > 1 ? { color: 'red' } : {};
                        const matriculaStyle = matriculaCounts[normalizedAlunoMatricula] > 1 ? { color: 'red' } : {};

                        return (
                            <div key={aluno.id}>
                                <p style={nameStyle}>Nome: {aluno.name}</p>
                                <p style={matriculaStyle}>Matrícula: {aluno.matricula}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };



    return (
        <div className='containerComponentLimitado'>
            {renderCreateModulo()}
            {renderCreateConteudo()}
            {renderCreateAula()}
            {renderCreateProva()}
            {renderCreateStorytelling()}
            {renderCreateGame()}
            {renderBuscarMatricula()}
        </div>
    );
}

export default ComponentLimitado;
*/







import PropTypes from 'prop-types';
import './ComponentLimitado.css'
import InputSend from '../InputSend/InputSend';
import { useEffect, useState } from 'react';
import InputDate from '../InputDate/InputDate';
import ButtonBold from '../ButtonBold/ButtonBold';
import DropDown from '../DropDown/DropDown';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { firestore, storage } from '../../services/firebaseConfig';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import InputText from '../InputText/InputText';
import Papa from 'papaparse'; 
import { evaluateTDAHPotential, evaluateTDIPotential, evaluateTEAPotential, evaluateTEAPPotential, evaluateTLPotential, evaluateTODPotential, fetchRastreios } from '../../functions/functions';

function ComponentLimitado() {
    const [rastreios, setRastreios] = useState([]);
    const [alunos, setAlunos] = useState([]);

    const getRastreios = async () => {
        try {
            const q = collection(firestore, "rastreios");
            const querySnapshot = await getDocs(q);
            
            const allRastreios = [];

            if (!querySnapshot.empty) {
                querySnapshot.forEach((doc) => {
                    allRastreios.push(doc.data());
                });

                setRastreios(allRastreios); // Define os rastreios encontrados
            } else {
                setRastreios([]); // Caso não haja nenhum rastreio
            }
        } catch (error) {
            console.error("Erro ao buscar rastreios:", error);
        }
    };

    const fetchUser = async () => {
        try {
            const querySnapshot = await getDocs(collection(firestore, 'users'));
    
            const alunosList = querySnapshot.docs.map(doc => ({
                id: doc.id,              
                userId: doc.data().userId, 
                email: doc.data().email,    
                name: doc.data().name,      
            }));
    
            setAlunos(alunosList);
            console.log("Alunos carregados com sucesso:", alunosList);
        } catch (error) {
            console.error("Erro ao carregar os alunos:", error);
        }
    };

    const formatDate = (timestamp) => {
        if (timestamp && timestamp.seconds) {
            const date = new Date(timestamp.seconds * 1000); // Converter segundos para milissegundos
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        }
        return 'Data inválida';
    };
    

    useEffect(() => {
        getRastreios();
        fetchUser();
    }, []);

    useEffect(() => {
        if (rastreios.length > 0 && alunos.length > 0) {
            console.log('Rastreios:', rastreios);
            console.log('Alunos:', alunos);
    
            rastreios.forEach((r, index) => {
                if (r && r.responses && r.patient) {
                    // Tente encontrar o aluno no array 'alunos'
                    const aluno = alunos.find(a => a.id === r.userId);
    
                    // Verifique se o aluno foi encontrado, se não, atribua "Não encontrado"
                    const alunoName = aluno ? (aluno.name && aluno.name !== '' ? aluno.name : aluno.email) : 'Não encontrado';
    
                    if (aluno) {
                        const { tdahPotential } = evaluateTDAHPotential(r.responses);
                        const { teaPotential } = evaluateTEAPotential(r.responses);
                        const { teapPotential } = evaluateTEAPPotential(r.responses);
                        const { tlPotential } = evaluateTLPotential(r.responses);
                        const { todPotential } = evaluateTODPotential(r.responses);
                        const { tdiPotential } = evaluateTDIPotential(r.responses);
    
                        // Lógica para definir o 'resultado'
                        let resultado = 'pp'; // Valor padrão é 'pp'
                        const potentials = [tdahPotential, teaPotential, teapPotential, tlPotential, todPotential, tdiPotential];
    
                        if (potentials.includes('mp')) {
                            resultado = 'mp';
                        } else if (potentials.includes('p')) {
                            resultado = 'p';
                        }
    
                        const line = {
                            data: formatDate(r.createdAt),
                            aluno: alunoName,
                            patient: r.patient,
                            tdahPotential,
                            teaPotential,
                            teapPotential,
                            tlPotential,
                            todPotential,
                            tdiPotential,
                            resultado, // Adiciona o campo 'resultado'
                        };
    
                        console.log(`Rastreio ${index}: `, { line });
                    } else {
                        // Caso o aluno não seja encontrado, exibe um aviso e coloca "Não encontrado"
                        const line = {
                            data: formatDate(r.createdAt),
                            aluno: 'Não encontrado',
                            patient: r.patient,
                            tdahPotential: null,
                            teaPotential: null,
                            teapPotential: null,
                            tlPotential: null,
                            todPotential: null,
                            tdiPotential: null,
                            resultado: 'pp', // Valor padrão é 'pp'
                        };
                        console.warn(`Aluno não encontrado para userId: ${r.userId} - Rastreio ${index}:`, line);
                        console.log(`Rastreio ${index}: `, { line });
                    }
                } else {
                    console.warn(`Rastreio ${index} não possui 'patient.responses'`);
                }
            });
        }
    }, [rastreios, alunos]);

    const generateCSV = () => {
        if (rastreios.length > 0 && alunos.length > 0) {
            const csvData = [];
    
            // Função para mapear os valores de potencial
            const mapPotentialToText = (potential) => {
                switch (potential) {
                    case 'pp':
                        return 'Baixo';
                    case 'p':
                        return 'Médio';
                    case 'mp':
                        return 'Alto';
                    default:
                        return 'Indefinido'; // Caso o valor seja inesperado
                }
            };
    
            rastreios.forEach((r) => {
                if (r && r.responses && r.patient) {
                    const aluno = alunos.find(a => a.id === r.userId);
    
                    const alunoName = aluno ? (aluno.name && aluno.name !== '' ? aluno.name : aluno.email) : 'Não encontrado';
    
                    if (aluno) {
                        const { tdahPotential } = evaluateTDAHPotential(r.responses);
                        const { teaPotential } = evaluateTEAPotential(r.responses);
                        const { teapPotential } = evaluateTEAPPotential(r.responses);
                        const { tlPotential } = evaluateTLPotential(r.responses);
                        const { todPotential } = evaluateTODPotential(r.responses);
                        const { tdiPotential } = evaluateTDIPotential(r.responses);
    
                        // Aplica a função de mapeamento para transformar os valores
                        const tdahText = mapPotentialToText(tdahPotential);
                        const teaText = mapPotentialToText(teaPotential);
                        const teapText = mapPotentialToText(teapPotential);
                        const tlText = mapPotentialToText(tlPotential);
                        const todText = mapPotentialToText(todPotential);
                        const tdiText = mapPotentialToText(tdiPotential);
    
                        let resultado = 'pp'; // Valor padrão é 'pp'
                        const potentials = [tdahPotential, teaPotential, teapPotential, tlPotential, todPotential, tdiPotential];
    
                        if (potentials.includes('mp')) {
                            resultado = 'mp';
                        } else if (potentials.includes('p')) {
                            resultado = 'p';
                        }
    
                        // Aplica o mapeamento para o 'resultado'
                        const resultadoText = mapPotentialToText(resultado);
    
                        // Adiciona os dados para a geração do CSV
                        csvData.push({
                            'Data': formatDate(r.createdAt),  // Usa a função para formatar
                            'Realizador do rastreio': alunoName,
                            'Nome do rastreado': r.patient,
                            'TDAH': tdahText,
                            'TEA': teaText,
                            'TEAP': teapText,
                            'TL': tlText,
                            'TOD': todText,
                            'TDI': tdiText,
                            'Resultado': resultadoText,
                        });
                    } else {
                        // Caso o aluno não tenha sido encontrado, ainda cria a entrada com 'Não encontrado'
                        const line = {
                            'Data': null,
                            'Realizador do rastreio': 'Não encontrado',
                            'Nome do rastreado': r.patient,
                            'TDAH': null,
                            'TEA': null,
                            'TEAP': null,
                            'TL': null,
                            'TOD': null,
                            'TDI': null,
                            'Resultado': 'pp', // Valor padrão é 'pp'
                        };
                        csvData.push(line);
                    }
                }
            });
    
            // Ordenar os dados do CSV pela coluna 'Realizador do rastreio' (nome ou email)
            csvData.sort((a, b) => {
                const nameA = a['Realizador do rastreio'].toLowerCase();
                const nameB = b['Realizador do rastreio'].toLowerCase();
                if (nameA < nameB) return -1;
                if (nameA > nameB) return 1;
                return 0;
            });
    
            // Gera o CSV e realiza o download
            const csv = Papa.unparse(csvData);
    
            const link = document.createElement('a');
            link.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
            link.target = '_blank';
            link.download = 'rastreios.csv';
            link.click();
        }
    };

    return (
        <div className='containerComponentLimitado'>
            <button onClick={generateCSV}>Gerar CSV Rastreios</button>
        </div>
    );
}

export default ComponentLimitado;


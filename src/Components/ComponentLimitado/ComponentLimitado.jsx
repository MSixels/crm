import PropTypes from 'prop-types';
import './ComponentLimitado.css'
import InputSend from '../InputSend/InputSend';
import { useEffect, useState } from 'react';
import InputDate from '../InputDate/InputDate';
import ButtonBold from '../ButtonBold/ButtonBold';
import DropDown from '../DropDown/DropDown';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../../services/firebaseConfig';

function ComponentLimitado() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [optionsProfessor, setOptionsProfessor] = useState([]);
    const [professor, setProfessor] = useState('');
    const [validade, setValidade] = useState('');
    const [loading, setLoading] = useState(true); 

    const fetchUsersFromFirestore = async () => {
        try {
            const q = query(collection(firestore, 'users'), where('type', '==', 2)); 
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
                    validade: validade,
                });
                alert("Módulo salvo com sucesso!");
                setName('')
                setDescription('')
                setProfessor('')
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
                
                <InputDate title='Validade' placeH='Selecione' onSearchChange={setValidade} />
                </div>
                <ButtonBold title='Salvar Módulo' icon action={() => salvarModulo(true)} />
            </div>
        );
    };










    const [optionsModulos, setOptionsModulos] = useState([])
    const [nameConteudo, setNameConteudo] = useState('');
    const [modulo, setModulo] = useState('')

    const fetchModulosFromFirestore = async () => {
        try {
            const q = query(collection(firestore, 'modulos'));  // Consulta todos os documentos da coleção 'modulos'
            const querySnapshot = await getDocs(q);
            const modulosList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            console.log('modulosList: ', modulosList);  // Exibe os módulos no console
            setOptionsModulos(modulosList);  // Atualiza o estado com a lista de módulos
        } catch (error) {
            console.error("Erro ao buscar módulos:", error);  // Exibe erro no console
        } finally {
            setLoading(false);  // Define como false após os dados serem carregados
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
                    videoUrl: videoUrl
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
    const [respostas, setRespostas] = useState([{ texto: '', correta: false }]);
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
                    quests: questsArray 
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

    return (
        <div className='containerComponentLimitado'>
            {renderCreateModulo()}
            {renderCreateConteudo()}
            {renderCreateAula()}
            {renderCreateProva()}
        </div>
    );
}

export default ComponentLimitado;

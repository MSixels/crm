import { useNavigate, useParams } from 'react-router-dom';
import './MaterialEdit.css'
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../../services/firebaseConfig';
import { IoMdArrowRoundBack } from 'react-icons/io';
import Loading from '../../Loading/Loading'
import { MdDelete } from 'react-icons/md';
import { 
    updateAula, 
    updateGame, 
    updateProva, 
    deleteAula, 
    deleteGame, 
    deleteProva, 
    deleteStoryTelling, 
    updateStoryTelling
} from '../../../functions/functions';


function MaterialEdit() {
    const navigate = useNavigate()
    const { moduloId } = useParams()
    const { type } = useParams()
    const { materialId } = useParams()
    const [loading, setLoading] = useState(true)
    const [aulaData, setAulaData] = useState(null);
    const [gameData, setGameData] = useState(null)
    const [provaData, setProvaData] = useState(null);
    const [storyData, setStoryData] = useState(null);

    const [aulaName, setAulaName] = useState('')
    const [aulaDescription, setAulaDescription] = useState('')
    const [aulaUrl, setAulaUrl] = useState('')

    const [gameName, setGameName] = useState('')
    const [gameDescription, setGameDescription] = useState('')
    const [gameLink, setGameLink] = useState('')

    const [provaName, setProvaName] = useState('')
    const [provaDescription, setProvaDescription] = useState('')
    const [quests, setQuests] = useState([])

    const [storyName, setStoryName] = useState('')
    const [storyDescription, setStoryDescription] = useState('')
    const [storyPdf, setStoryPdf] = useState({})
    const [labelConfirm, setLabelConfirm] = useState(false)

    const fetchAulas = async (materialId) => {
        try {
            const aulaRef = doc(firestore, 'aulas', materialId);
            const aulaSnap = await getDoc(aulaRef);
            
            if (aulaSnap.exists()) {
                if(aulaSnap.data().type === 'aula'){
                    console.log('Aula', aulaSnap.data())
                    setAulaData(aulaSnap.data())
                    setAulaName(aulaSnap.data().name)
                    setAulaDescription(aulaSnap.data().description)
                    setAulaUrl(aulaSnap.data().videoUrl)
                    setLoading(false)
                } else if(aulaSnap.data().type === 'game'){
                    console.log('Gameficação', aulaSnap.data())
                    setGameData(aulaSnap.data())
                    setGameName(aulaSnap.data().name)
                    setGameDescription(aulaSnap.data().description)
                    setGameLink(aulaSnap.data().link)
                    setLoading(false)
                } else {
                    console.log('Type não encontrado')
                    setLoading(false)
                }
            } else {
                console.log("Aula não encontrada");
                setLoading(false)
            }
        } catch (error) {
            console.error("Erro ao carregar a aula:", error);
            setLoading(false)
        }
    };

    const fetchProvas = async (materialId) => {
        try {
            const provaRef = doc(firestore, 'provas', materialId);
            const provaSnap = await getDoc(provaRef);
            if (provaSnap.exists()) {
                if(provaSnap.data().type === 'prova'){
                    setProvaData(provaSnap.data())
                    setProvaName(provaSnap.data().name)
                    setProvaDescription(provaSnap.data().description)
                    setQuests(provaSnap.data().quests)
                    setLoading(false)
                } else if(provaSnap.data().type === 'storyTelling'){
                    console.log('storyTelling: ', provaSnap.data())
                    setStoryData(provaSnap.data())
                    setStoryName(provaSnap.data().name)
                    setStoryDescription(provaSnap.data().description)
                    setStoryPdf(provaSnap.data().pdfUrl)
                    setLoading(false)
                } else {
                    console.log('Type não encontrado')
                    setLoading(false)
                }
            } else {
                console.log("Prova não encontrada");
                setLoading(false)
            }
        } catch (error) {
            console.error("Erro ao carregar a prova:", error);
            setLoading(false)
        }
    };

    useEffect(() => {
        try{
            if (type === 'aula' || type === 'game') {
                fetchAulas(materialId);
            } else if(type === 'prova' || type === 'storyTelling'){
                fetchProvas(materialId)
            } else {
                console.log('Type não encontrado')
                setLoading(false)
            }
        } catch (error) {
            console.log('Erro ao executar fetchAulas ou fetchProvas: ', error)
            setLoading(false)
        }
        
    }, [materialId, type]);

    const renderAula = () => {

        const handleUpdate = () => {
            updateAula(materialId, aulaName, aulaDescription, aulaUrl, type)
        }

        const handleDelete = async () => {
            const deleted = await deleteAula(materialId);
            if (deleted) {
                navigate(`/professor/modulos/${moduloId}`);
            }
        };

        const handleInputChangeName = (event) => {
            setAulaName(event.target.value);
        };

        const handleInputChangeDescription = (event) => {
            setAulaDescription(event.target.value);
        };

        const handleInputChangeUrl = (event) => {
            setAulaUrl(event.target.value);
        };

        return(
            <div className='containerItem'>
                <div className='divBtns end'>
                    <button className='btnConfirm' onClick={handleUpdate}>Salvar alterações</button>
                </div>
                <div className='contents'>
                    <div className='divInput'>
                        <label htmlFor="name">Nome</label>
                        <input
                            id='name'
                            type="text"
                            value={aulaName}            
                            onChange={handleInputChangeName}
                        />
                    </div>
                    <div 
                        style={{
                            display: 'flex', 
                            flexDirection: 'column', 
                            position: 'relative', 
                            paddingBottom: 12, 
                            marginTop: 16
                        }}>
                        <label htmlFor="coment" 
                            style={{
                                position: 'absolute', 
                                top: -10, 
                                fontSize: 12, 
                                left: 12, 
                                backgroundColor: '#FFF', 
                                paddingInline: 4
                            }}>Descrição</label>
                        <textarea
                            name="coment"
                            id="coment"
                            maxLength="500"
                            style={{ 
                                height: 150, 
                                outline: 'none', 
                                padding: 8, 
                                border: 'solid 1px #ccc', 
                                borderRadius: 4, 
                                maxWidth: '100%', 
                                minWidth: 200, 
                                maxHeight: 200, 
                                minHeight: 100 
                            }}
                            value={aulaDescription}
                            onChange={handleInputChangeDescription}
                        ></textarea>
                        <p style={{marginLeft: 8, fontSize: 12}}>{aulaDescription.length}/500</p>
                    </div>
                    <p style={{ fontSize: 16, fontWeight: 500, marginTop: 24, marginBottom: 12}}>Vídeo</p>
                    <div className='divInput'>
                        <label htmlFor="url">Vídeo (url do YouTube)</label>
                        <input
                            id='url'
                            type="text"
                            value={aulaUrl}            
                            onChange={handleInputChangeUrl}
                        />
                    </div>
                </div>
                <div className='divBtns'>
                    <button className='btnConfirm alert' onClick={handleDelete}>Excluir {type}</button>
                    <button className='btnConfirm' onClick={handleUpdate}>Salvar alterações</button>
                </div>
            </div>
        )
    }

    const renderGame = () => {

        const handleUpdate = () => {
            updateGame(materialId, gameName, gameDescription, gameLink, type)
        }

        const handleDelete = async () => {
            const deleted = await deleteGame(materialId);
            if (deleted) {
                navigate(`/professor/modulos/${moduloId}`);
            }
        };

        const handleInputChangeName = (event) => {
            setGameName(event.target.value);
        };

        const handleInputChangeDescription = (event) => {
            setGameDescription(event.target.value);
        };

        const handleInputChangeLink = (event) => {
            setGameLink(event.target.value);
        };

        return(
            <div className='containerItem'>
                <div className='divBtns end'>
                    <button className='btnConfirm' onClick={handleUpdate}>Salvar alterações</button>
                </div>
                <div className='contents'>
                    <div className='divInput'>
                        <label htmlFor="name">Nome</label>
                        <input
                            id='name'
                            type="text"
                            value={gameName}            
                            onChange={handleInputChangeName}
                        />
                    </div>
                    <div 
                        style={{
                            display: 'flex', 
                            flexDirection: 'column', 
                            position: 'relative', 
                            paddingBottom: 12, 
                            marginTop: 16
                        }}>
                        <label htmlFor="coment" 
                            style={{
                                position: 'absolute', 
                                top: -10, 
                                fontSize: 12, 
                                left: 12, 
                                backgroundColor: '#FFF', 
                                paddingInline: 4
                            }}>Descrição</label>
                        <textarea
                            name="coment"
                            id="coment"
                            maxLength="500"
                            style={{ 
                                height: 150, 
                                outline: 'none', 
                                padding: 8, 
                                border: 'solid 1px #ccc', 
                                borderRadius: 4, 
                                maxWidth: '100%', 
                                minWidth: 200, 
                                maxHeight: 200, 
                                minHeight: 100 
                            }}
                            value={gameDescription}
                            onChange={handleInputChangeDescription}
                        ></textarea>
                        <p style={{marginLeft: 8, fontSize: 12}}>{aulaDescription.length}/500</p>
                    </div>
                    <p style={{ fontSize: 16, fontWeight: 500, marginTop: 24, marginBottom: 12}}>Link</p>
                    <div className='divInput'>
                        <label htmlFor="link">Link da gameficação</label>
                        <input
                            id='link'
                            type="text"
                            value={gameLink}            
                            onChange={handleInputChangeLink}
                        />
                    </div>
                </div>
                <div className='divBtns'>
                    <button className='btnConfirm alert' onClick={handleDelete}>Excluir {type}</button>
                    <button className='btnConfirm' onClick={handleUpdate}>Salvar alterações</button>
                </div>
            </div>
        )
    }

    const renderProva = () => {

        const handleUpdate = () => {
            updateProva(materialId, provaName, provaDescription, quests, type)
        }

        const handleDelete = async () => {
            const deleted = await deleteProva(materialId);
            if (deleted) {
                navigate(`/professor/modulos/${moduloId}`);
            }
        };

        const handleInputChangeName = (event) => {
            setProvaName(event.target.value);
        };
        
        const handleInputChangeDescription = (event) => {
            setProvaDescription(event.target.value);
        };
        
        const handleQuestionChange = (newQuest, index) => {
            const updatedQuests = [...quests];
            updatedQuests[index].quest = newQuest;
            setQuests(updatedQuests);
        };
        
        const handleAnswerChange = (newText, questIndex, answerIndex) => {
            const updatedQuests = [...quests];
            updatedQuests[questIndex].responses[answerIndex].text = newText;
            setQuests(updatedQuests);
        };
        
        const addQuestion = () => {
            if (quests.length >= 30) {
                alert("Máximo de 30 questões atingido.");
                return;
            }
        
            if (quests.some(quest => quest.quest.trim() === '')) {
                alert("Preencha a pergunta antes de adicionar uma nova.");
                return;
            }
        
            setQuests([...quests, { quest: '', responses: [{ text: '', value: false }] }]);
        };
        
        const addAnswer = (questIndex) => {
            const updatedQuests = [...quests];
            const currentQuest = updatedQuests[questIndex];
        
            if (currentQuest.responses.some(response => response.text.trim() === '')) {
                alert("Preencha todas as respostas antes de adicionar uma nova.");
                return;
            }
        
            currentQuest.responses.push({ text: '', value: false });
            setQuests(updatedQuests);
        };
        
        const markCorrectAnswer = (questIndex, answerIndex) => {
            const updatedQuests = [...quests];
            updatedQuests[questIndex].responses = updatedQuests[questIndex].responses.map((response, i) => ({
                ...response,
                value: i === answerIndex
            }));
            setQuests(updatedQuests);
        };

        const removeQuestion = (questIndex) => {
            const updatedQuests = quests.filter((_, index) => index !== questIndex);
            setQuests(updatedQuests);
        };
        
        const removeAnswer = (questIndex, answerIndex) => {
            const updatedQuests = [...quests];
            updatedQuests[questIndex].responses = updatedQuests[questIndex].responses.filter((_, i) => i !== answerIndex);
            setQuests(updatedQuests);
        };
        
        return (
            <div className='containerItem'>
                <div className='divBtns end'>
                    <button className='btnConfirm' onClick={handleUpdate}>Salvar alterações</button>
                </div>
                <div className='contents'>
                    <div className='divInput'>
                        <label htmlFor="name">Título</label>
                        <input
                            id='name'
                            type="text"
                            value={provaName}
                            onChange={handleInputChangeName}
                        />
                    </div>
                    <div 
                        style={{
                            display: 'flex', 
                            flexDirection: 'column', 
                            position: 'relative', 
                            paddingBottom: 12, 
                            marginTop: 16
                        }}
                    >
                        <label htmlFor="coment" 
                            style={{
                                position: 'absolute', 
                                top: -10, 
                                fontSize: 12, 
                                left: 12, 
                                backgroundColor: '#FFF', 
                                paddingInline: 4
                            }}
                        >Descrição</label>
                        <textarea
                            name="coment"
                            id="coment"
                            maxLength="500"
                            style={{ 
                                height: 150, 
                                outline: 'none', 
                                padding: 8, 
                                border: 'solid 1px #ccc', 
                                borderRadius: 4, 
                                maxWidth: '100%', 
                                minWidth: 200, 
                                maxHeight: 200, 
                                minHeight: 100 
                            }}
                            value={provaDescription}
                            onChange={handleInputChangeDescription}
                        ></textarea>
                        <p style={{marginLeft: 8, fontSize: 12}}>{provaDescription.length}/500</p>
                    </div>
                    <div className='divHeaderQuests'>
                        <p style={{ fontSize: 16, fontWeight: 500, marginTop: 24, marginBottom: 12}}>Questões da prova (Max 30)</p>
                        <button onClick={addQuestion} className='btnAdd' style={{ marginTop: 16 }}>Adicionar pergunta</button>
                    </div>
                    <div>
                        {quests.map((quest, questIndex) => (
                            <div key={questIndex} style={{ marginBottom: 20 }} className='divQuests'>
                                <div className='divQuest'>
                                    <div className='divInput maxW'>
                                        <label>Pergunta {questIndex + 1}</label>
                                        <input
                                            type="text"
                                            value={quest.quest}
                                            onChange={(e) => handleQuestionChange(e.target.value, questIndex)}
                                            placeholder="Digite a pergunta"
                                        />
                                    </div>
                                    <div className='divIcon delete' onClick={() => removeQuestion(questIndex)}>
                                        <MdDelete size={24} />
                                    </div>
                                </div>
                                <div>
                                    {quest.responses.map((response, responseIndex) => (
                                        <div key={responseIndex} className='divRespostas'>
                                            <div className='divInput maxW'>
                                                <label>Resposta {responseIndex + 1}</label>
                                                <input
                                                    type="text"
                                                    value={response.text}
                                                    onChange={(e) => handleAnswerChange(e.target.value, questIndex, responseIndex)}
                                                    placeholder="Digite a resposta"
                                                />
                                            </div>
                                            <div className='divBtnSelectResponse'>
                                                <div>
                                                    <div className='divCircle' onClick={() => markCorrectAnswer(questIndex, responseIndex)}>
                                                        <div className={`divBall ${quests[questIndex].responses[responseIndex].value ? 'active' : ''}`}></div>
                                                    </div>
                                                </div>
                                                <p>Resposta correta</p>
                                            </div>
                                            <div className='divIcon delete' onClick={() => removeAnswer(questIndex, responseIndex)}>
                                                <MdDelete size={24}/>
                                            </div>
                                        </div>
                                    ))}
                                    <button onClick={() => addAnswer(questIndex)} className='btnAdd'>Adicionar resposta</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {quests.length > 1 && <div className='divHeaderQuests'>
                        <p style={{ fontSize: 16, fontWeight: 500, marginTop: 24, marginBottom: 12}}>Questões da prova (Max 30)</p>
                        <button onClick={addQuestion} className='btnAdd' style={{ marginTop: 16 }}>Adicionar pergunta</button>
                    </div>}
                    
                </div>
                <div className='divBtns'>
                    <button className='btnConfirm alert' onClick={handleDelete}>Excluir {type}</button>
                    <button className='btnConfirm' onClick={handleUpdate}>Salvar alterações</button>
                </div>
            </div>
        );
    }

    useEffect(() => {
        if(storyPdf.name){
            setLabelConfirm(true);
        }
        
    }, [storyPdf.name])

    const renderStoryTelling = () => {

        const handleUpdate = () => {
            updateStoryTelling(materialId, storyName, storyDescription, storyPdf, type)
        }

        const handleDelete = async () => {
            const deleted = await deleteStoryTelling(materialId);
            if (deleted) {
                navigate(`/professor/modulos/${moduloId}`);
            }
        };

        const handleInputChangeName = (event) => {
            setStoryName(event.target.value);
        };

        const handleInputChangeDescription = (event) => {
            setStoryDescription(event.target.value);
        };

        const handleInputFilePDF = (event) => {
            const file = event.target.files[0];
            if (file) {
                setStoryPdf(file)
            } else {
                setLabelConfirm(false);
            }
        }

        return(
            <div className='containerItem'>
                <div className='divBtns end'>
                    <button className='btnConfirm' onClick={handleUpdate}>Salvar alterações</button>
                </div>
                <div className='contents'>
                    <div className='divInput'>
                        <label htmlFor="name">Nome</label>
                        <input
                            id='name'
                            type="text"
                            value={storyName}            
                            onChange={handleInputChangeName}
                        />
                    </div>
                    <div 
                        style={{
                            display: 'flex', 
                            flexDirection: 'column', 
                            position: 'relative', 
                            paddingBottom: 12, 
                            marginTop: 16
                        }}>
                        <label htmlFor="coment" 
                            style={{
                                position: 'absolute', 
                                top: -10, 
                                fontSize: 12, 
                                left: 12, 
                                backgroundColor: '#FFF', 
                                paddingInline: 4
                            }}>Descrição</label>
                        <textarea
                            name="coment"
                            id="coment"
                            maxLength="500"
                            style={{ 
                                height: 150, 
                                outline: 'none', 
                                padding: 8, 
                                border: 'solid 1px #ccc', 
                                borderRadius: 4, 
                                maxWidth: '100%', 
                                minWidth: 200, 
                                maxHeight: 200, 
                                minHeight: 100 
                            }}
                            value={storyDescription}
                            onChange={handleInputChangeDescription}
                        ></textarea>
                        <p style={{marginLeft: 8, fontSize: 12}}>{storyDescription.length}/500</p>
                    </div>
                    <p style={{ fontSize: 16, fontWeight: 500, marginTop: 24, marginBottom: 12}}>Material complementar (PDF)</p>
                    <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                        <label htmlFor="pdf" className={`labelFile ${labelConfirm && 'active'}`}>{labelConfirm ? 'Selecionar outro' : 'Selecionar arquivo'}</label>
                        <input type='file' id='pdf' style={{display: 'none'}} onChange={handleInputFilePDF}/>
                        {storyPdf.name ? <p style={{fontSize: 14}}>{storyPdf.name}</p> : storyData.pdfUrl !== 'Sem arquivo'  ? <p style={{fontSize: 14}}>Já existe um arquivo salvo</p> : ''}
                    </div>
                </div>
                <div className='divBtns'>
                    <button className='btnConfirm alert' onClick={handleDelete}>Excluir {type}</button>
                    <button className='btnConfirm' onClick={handleUpdate}>Salvar alterações</button>
                </div>
            </div>
        )
    }

    if(loading){
        return <Loading />
    }

    return (
        <div className='containerMaterialEdit'>
            <div className='divHeader'>
                <div className='divIcon' onClick={() => navigate(`/professor/modulos/${moduloId}`)}>
                    <IoMdArrowRoundBack />
                </div>
                <h2>Editar {type === 'aula' ? 'aula' : type === 'game' ? 'gameficação' : type === 'prova' ? 'prova' : type === 'storyTelling' ? 'storytelling' : ''}</h2>
            </div>
            {
                type === 'aula' && aulaData ? renderAula() : 
                type === 'game' && gameData ? renderGame() : 
                type === 'prova' && provaData ? renderProva() : 
                type === 'storyTelling' && storyData ? renderStoryTelling() : 
                ''
            }
        </div>
    )
}

export default MaterialEdit;
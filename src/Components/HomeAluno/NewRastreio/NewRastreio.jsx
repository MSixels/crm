import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import './NewRastreio.css';
import { questsRestreioType1, questsRestreioType2, questsRestreioType3 } from '../../../database';
import { useEffect, useState } from 'react';
import { IoChevronBackSharp } from "react-icons/io5";
import { GrFormNext } from "react-icons/gr";
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../../../services/firebaseConfig'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'
import Header from '../../Header/Header'
import { IoChevronBack } from "react-icons/io5";

function NewRastreio() {
    const { page } = useParams();
    const navigate = useNavigate()

    const [selectedOptions, setSelectedOptions] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [disabled, setDisabled] = useState(true); 
    const [allResponses, setAllResponses] = useState([]);
    const [searchParams] = useSearchParams();
    const patient = searchParams.get('patient');
    const school = searchParams.get('school');
    const [userId, setUserId] = useState('')
    const [typeQuestSelected, setTypeQuestSelected] = useState(null)

    useEffect(() => {
        if (page === 'novo-rastreio-tipo-1') {
            setTypeQuestSelected(1)
        }
        else if (page === 'novo-rastreio-tipo-2') {
            setTypeQuestSelected(2)
        }
        else if (page === 'novo-rastreio-tipo-3') {
            setTypeQuestSelected(3)
        }
        else {
            setTypeQuestSelected(null)
        }
    }, [page])

    useEffect(() => {
        const sessao = Cookies.get('accessToken');
        if (sessao) {
            return;
        } else {
            navigate('/login/aluno');
        }
    }, [navigate]);

    useEffect(() => {
        const accessToken = Cookies.get('accessToken');

        if (accessToken) {
            const decodedToken = jwtDecode(accessToken);
            setUserId(decodedToken.user_id)
        } else {
            console.log("Nenhum token encontrado nos cookies.");
            navigate('/login/aluno');
        }
    }, [navigate]);
    
    const handleOptionSelect = (questId, optionId) => {
        setSelectedOptions(prevState => ({
            ...prevState,
            [questId]: optionId 
        }));
    };

    const pagesViews = [1, 2, 3, 4];

    const pagesBar = [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
    ];

    const handleBack = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const selectedList = () => {
        if (typeQuestSelected === 1) {
            return questsRestreioType1;
        }
        if (typeQuestSelected === 2) {
            return questsRestreioType2;
        }
        if (typeQuestSelected === 3) {
            return questsRestreioType3;
        }
        return [];
    };

    const allQuestions = selectedList(); 
    const paginatedQuestions = allQuestions.slice((currentPage - 1) * 8, currentPage * 8);

    const handleNext = async (e) => {
        e.preventDefault()
        const allAnswered = paginatedQuestions.every(q => selectedOptions[q.id] !== undefined);
    
        if (!allAnswered) {
            return;
        }
    
        const responses = paginatedQuestions.map(q => ({
            id: q.id,
            quest: q.id,
            value: selectedOptions[q.id],
        }));
    
        setAllResponses(prevResponses => [...prevResponses, ...responses]);
    
        if (currentPage < pagesViews.length) {
            setCurrentPage(prev => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            try {
                if (patient && allResponses) {
                    const docRef = await addDoc(collection(firestore, "rastreios"), {
                        patient: patient,
                        school: school,
                        userId: userId,
                        typeQuest: typeQuestSelected,
                        responses: allResponses.concat(responses),
                        createdAt: new Date()
                    });
    
                    const documentId = docRef.id; 
    
                    await updateDoc(doc(firestore, "rastreios", documentId), {
                        id: documentId 
                    });
    
                    console.log("Documento adicionado com ID: ", documentId);
    
                    navigate(`/aluno/rastreio?success=true&name=${patient}&idade=${typeQuestSelected}`);
                } else {
                    console.log('Verifique se você marcou todas as questões!');
                }
            } catch (e) {
                console.error("Erro ao adicionar documento: ", e);
            }
        }
    };

    useEffect(() => {
        const allAnswered = paginatedQuestions.every(q => selectedOptions[q.id] !== undefined);
        setDisabled(!allAnswered); 
    }, [selectedOptions, currentPage, paginatedQuestions]); 

    const options = [
        {
            id: 1,
            text: 'início',
            route: '/aluno/home',
            status: 'active'
        },
        {
            id: 2,
            text: 'Rastreio',
            route: `/aluno/rastreio/${page}`,
            status: 'active'
        },
        {
            id: 3,
            text: 'Módulos e aulas',
            route: '/aluno/modulos',
            status: 'active'
        },
    ]

    return (
        <div className='containerNewRastreio'>
            <Header options={options}/>
            <div className='divTitle'>
                <dir className='divIcon' onClick={() => navigate('/aluno/rastreio')}>
                    <IoChevronBack size={20}/>
                </dir>
                <h2>Novo rastreio</h2>
            </div>
            <div className='divContent'>
                <div className='divHeader'>
                    <h2 style={{ marginBottom: 32, fontSize: 20 }}>
                        ESCALA DE RASTREAMENTO RADY E BORGES PARA CRIANÇAS{' '}
                        <span>
                            {page === 'novo-rastreio-tipo-1' 
                                ? 'ENTRE 3 E 6 ANOS' 
                                : page === 'novo-rastreio-tipo-2' 
                                ? 'ATÉ 8 ANOS' 
                                : page === 'novo-rastreio-tipo-3' 
                                ? 'ACIMA DE 8 ANOS' 
                                : ''}
                        </span>
                    </h2>
                    <p style={{ marginBottom: 20, fontSize: 18 }} className='secondary900'>
                        <span style={{ fontWeight: 'bold' }}>Objetivo:</span> Analisar o potencial de risco do Paciente para determinados transtornos, espectros e condições.
                    </p>
                    <p style={{ marginBottom: 20, fontSize: 18 }} className='secondary900'>
                        <span style={{ fontWeight: 'bold' }}>Tópicos de avaliação:</span>
                    </p>
                    <ul className='listTopicos'>
                        <li style={{ fontSize: 16 }}>Comportamentos Repetitivos e Estereotipados</li>
                        <li style={{ fontSize: 16 }}>Dificuldades de Comunicação</li>
                        <li style={{ fontSize: 16 }}>Habilidades Sociais e Interações</li>
                        <li style={{ fontSize: 16 }}>Sensibilidade Sensorial</li>
                        <li style={{ fontSize: 16 }}>Adaptabilidade e Flexibilidade Cognitiva</li>
                    </ul>
                    <div className='divBarPages'>
                        {pagesBar.map((p) => (
                            <div 
                                key={p.id} 
                                className={`bar ${p.id <= currentPage ? 'active' : ''}`} 
                            ></div>
                        ))}
                    </div>
                </div>
                <div className='divOptions'>
                    {paginatedQuestions.map((qr) => (
                        <div key={qr.id} className='divOption'>
                            <p className='title'>{qr.id}. {qr.quest}</p>
                            <div className='btns'>
                                {qr.options.map((op) => (
                                    <div 
                                        key={op.id} 
                                        className={`divBtn ${selectedOptions[qr.id] === op.id ? 'active' : ''}`} 
                                        onClick={() => handleOptionSelect(qr.id, op.id)} 
                                    >
                                        <div className='circle'>
                                            <div className={`${selectedOptions[qr.id] === op.id ? 'ball' : ''}`}></div>
                                        </div>
                                        <p className='textOption'>{op.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className='footer'>
                    <div className='backNext'>
                        <div 
                            className={`divIcon ${currentPage === 1 ? 'blur' : ''}`} 
                            onClick={handleBack}
                        >
                            <IoChevronBackSharp size={20}/>
                        </div>
                        <p style={{ fontSize: 18 }}>{currentPage}/{pagesViews.length}</p>
                        <div 
                            className={`divIcon ${(currentPage === pagesViews.length || disabled) ? 'blur' : ''}`} 
                            onClick={handleNext}
                        >
                            <GrFormNext size={50}/>
                        </div>
                    </div>
                    <div>
                        <div onClick={handleNext} className={`btnNextSave ${disabled && 'disabled'}`}>
                            <span>{currentPage === pagesViews.length ? 'Salvar' : 'Avançar'}</span>
                            <GrFormNext />
                        </div>
                    </div>
                </div>
            </div>
            <div className='divCancel'>
                <div className='divBtn' onClick={() => navigate('/aluno/rastreio')}>
                    <p>Cancelar rastreio</p>
                </div>
            </div>
        </div>
    );
}

export default NewRastreio;

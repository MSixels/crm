import { useEffect, useState } from 'react';
import './Prova.css';
import PropTypes from 'prop-types';
import { firestore } from '../../../services/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { FaBookOpen, FaCircleChevronLeft, FaCircleChevronRight } from 'react-icons/fa6';
import ButtonConfirm from '../../ButtonConfirm/ButtonConfirm';

function Prova({ materialId, confirmProva }) {
const [provas, setProvas] = useState([]);
const [selectedResponses, setSelectedResponses] = useState({});
const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

useEffect(() => {
    const fetchProvasData = async () => {
    try {
        const querySnapshot = await getDocs(collection(firestore, 'provas'));
        const provasArray = [];
        querySnapshot.forEach((doc) => {
        provasArray.push({ id: doc.id, ...doc.data() });
        });

        const provaFiltrada = provasArray.filter((prova) => prova.id === materialId);

        setProvas(provaFiltrada);
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
    }
    };

    if (materialId) {
    fetchProvasData();
    }
}, [materialId]);

const handleSelectResponse = (questionIndex, responseIndex) => {
    setSelectedResponses((prevSelectedResponses) => ({
    ...prevSelectedResponses,
    [questionIndex]: responseIndex,
    }));
};

const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
};

const handlePreviousQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
};

const proximaEtapa = (confirm) => {
    if(confirm){
        confirmProva(confirm);
    }
};

return (
    <div className='containerProva'>
    {provas.length > 0 && (
        <div>
        <div className='titleIcon'>
            <div className='divIconAula'>
            <FaBookOpen />
            </div>
            <h2 className='testTitle'>{provas[0].name}</h2>
        </div>
        <p>{provas[0].description}</p>
        {provas[0].quests.length > 0 && (
            <div style={{ marginTop: 20 }}>
            <p className='testQuestion' style={{ marginBottom: 5 }}>
                {provas[0].quests[currentQuestionIndex].quest}
            </p>
            {provas[0].quests[currentQuestionIndex].responses.map((r, responseIndex) => (
                <ul className='testOptions' key={responseIndex}>
                <li className='testOptionItem'>
                <label>
                    <input
                    type='checkbox'
                    checked={selectedResponses[currentQuestionIndex] === responseIndex}
                    onChange={() => handleSelectResponse(currentQuestionIndex, responseIndex)}
                    />
                </label>
                {r.text}
                </li>
            </ul>

            ))}
            <div className='navigationButtons'>
                <div className="justify-btns">
                <button
                className='btn-nav'
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                color='#CED7DE'
                >
                <FaCircleChevronLeft size={24} />
                </button>
                <span className='questionCounter'>
                {currentQuestionIndex + 1} / {provas[0].quests.length}
                </span>
                <button
                className='btn-nav'
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex === provas[0].quests.length - 1}
                >
                <FaCircleChevronRight size={24} />
                </button>
                </div>
                {currentQuestionIndex === provas[0].quests.length - 1 && (
                <div className="btn-next-content"><ButtonConfirm title='Salvar e avançar' icon={<FaCircleChevronRight size={18}/>} action={proximaEtapa}/></div>
                )}
            </div>
            </div>
        )}
        </div>
    )}
    </div>
);
}

Prova.propTypes = {
    materialId: PropTypes.string.isRequired,
    confirmProva: PropTypes.bool.isRequired,
};

export default Prova;

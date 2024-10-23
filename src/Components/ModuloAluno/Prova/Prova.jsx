import { useEffect, useState } from 'react';
import './Prova.css';
import PropTypes from 'prop-types';
import { firestore } from '../../../services/firebaseConfig';
import {  doc, getDoc, setDoc } from 'firebase/firestore';
import { FaBookOpen, FaCircleChevronLeft, FaCircleChevronRight } from 'react-icons/fa6';
import ButtonConfirm from '../../ButtonConfirm/ButtonConfirm';
import { useNavigate, useParams } from 'react-router-dom';

function Prova({ materialId, userId }) {
  const [provas, setProvas] = useState([]);
  const [selectedResponses, setSelectedResponses] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { moduloId } = useParams();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(30 * 60);

  const calculateRemainingTime = () => {
    const startTime = localStorage.getItem('startTime');
    if (startTime) {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      return Math.max(30 * 60 - elapsed, 0);
    }
    return 30 * 60;
  };

  useEffect(() => {
    const savedProvas = JSON.parse(localStorage.getItem('provas'));
    const savedResponses = JSON.parse(localStorage.getItem('selectedResponses'));
    const savedQuestionIndex = parseInt(localStorage.getItem('currentQuestionIndex'), 10);
    
    if (savedProvas) setProvas(savedProvas);
    if (savedResponses) setSelectedResponses(savedResponses);
    if (!isNaN(savedQuestionIndex)) setCurrentQuestionIndex(savedQuestionIndex);

    const remainingTime = calculateRemainingTime();
    setTimeLeft(remainingTime);
  }, []);

  useEffect(() => {
    const fetchProvasData = async () => {
      try {
        const provaDocRef = doc(firestore, 'provas', materialId);
        const provaDoc = await getDoc(provaDocRef);
  
        if (provaDoc.exists()) {
          const provaData = provaDoc.data();

          let randomQuestions;
          const savedProvas = JSON.parse(localStorage.getItem('provas'));
  
          if (savedProvas && savedProvas[0].id === materialId) {
            randomQuestions = savedProvas[0].quests; 
          } else {
            randomQuestions = provaData.quests
              .sort(() => 0.5 - Math.random())
              .slice(0, 5);
            localStorage.setItem('provas', JSON.stringify([{ ...provaData, quests: randomQuestions }]));
          }
  
          setProvas([{ ...provaData, quests: randomQuestions }]);
        } else {
          console.error('Prova não encontrada');
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };
  
    if (materialId) {
      fetchProvasData();
    }
  }, [materialId]);
  

  useEffect(() => {
    if (timeLeft === 0) {
      confirmMaterial(true);  
      navigate(`/aluno/modulo/${moduloId}`);  
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1;
        localStorage.setItem('timeLeft', newTime); 
        return newTime;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, navigate, moduloId]);

  useEffect(() => {
    if (!localStorage.getItem('startTime')) {
      localStorage.setItem('startTime', Date.now());
    }
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleSelectResponse = (questionIndex, responseIndex) => {
    const updatedResponses = {
      ...selectedResponses,
      [questionIndex]: responseIndex,
    };
    setSelectedResponses(updatedResponses);
    localStorage.setItem('selectedResponses', JSON.stringify(updatedResponses));
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => {
      const newIndex = prevIndex + 1;
      localStorage.setItem('currentQuestionIndex', newIndex);
      return newIndex;
    });
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => {
      const newIndex = prevIndex - 1;
      localStorage.setItem('currentQuestionIndex', newIndex);
      return newIndex;
    });
  };

  const provaConfirm = async (userId, provaId) => {
    try {
      const progressRef = doc(firestore, 'progressProvas', `${userId}_${provaId}`);
      const progressDoc = await getDoc(progressRef);
      let correctAnswers = 0;
      const totalQuestions = provas[0].quests.length;
  
      // Calculando respostas corretas
      provas[0].quests.forEach((quest, index) => {
        const selectedResponseIndex = selectedResponses[index];
        if (selectedResponseIndex !== undefined && quest.responses[selectedResponseIndex].correct === true) {
          correctAnswers += 1;
        }
      });
  
      // Nota baseada no número de respostas corretas
      const score = (correctAnswers / totalQuestions) * 100;
  
      if (progressDoc.exists()) {
        await setDoc(progressRef, { status: 'end', score }, { merge: true });
        console.log('Progresso da prova atualizado com sucesso!');
      } else {
        const progressData = {
          userId: userId,
          provaId: provaId,
          status: 'end',
          score: score, 
        };
        await setDoc(progressRef, progressData);
        console.log('Progresso da prova criado e atualizado com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao criar ou atualizar o progresso da prova:', error);
    }
  };
  
  
  
  const confirmMaterial = (confirm) => {
    if (confirm) {
      if (provas[0].id === materialId) {
        provaConfirm(userId, materialId).then(() => {
          localStorage.removeItem('provas');
          localStorage.removeItem('selectedResponses');
          localStorage.removeItem('currentQuestionIndex');
          localStorage.removeItem('startTime');
          navigate(`/aluno/modulo/${moduloId}`);
        });
      }
    }
  };
  

  const allQuestionsAnswered = provas[0]?.quests.length === Object.keys(selectedResponses).length;

  const handleButtonClick = () => {
    if (allQuestionsAnswered) {
      confirmMaterial(true);
    }
  };

  try {
    return (
      <div className='containerProva'>
        <div className="timer">
          <p>Tempo restante: {formatTime(timeLeft)}</p>
        </div>
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
                    <div className="btn-next-content">
                      <ButtonConfirm
                        title='Salvar e avançar'
                        icon={<FaCircleChevronRight size={18} />}
                        action={handleButtonClick}
                        disabled={!allQuestionsAnswered}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  } catch (error) {
    return <p>Deu Erro</p>;
  }
}

Prova.propTypes = {
  materialId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
};

export default Prova;

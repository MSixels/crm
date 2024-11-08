import { useEffect, useState } from 'react';
import './Prova.css';
import PropTypes from 'prop-types';
import { firestore } from '../../../services/firebaseConfig';
import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { FaBookOpen, FaCircleChevronLeft, FaCircleChevronRight } from 'react-icons/fa6';
import ButtonConfirm from '../../ButtonConfirm/ButtonConfirm';
import { useNavigate, useParams } from 'react-router-dom';
import { TbRuler3 } from 'react-icons/tb';
import Loading from '../../Loading/Loading';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'

function Prova({ materialId, userId, contentId }) {
  const [provas, setProvas] = useState([]);
  const [selectedResponses, setSelectedResponses] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { moduloId } = useParams();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [provaFinish, setProvaFinish] = useState([])
  const [loading, setLoading] = useState(TbRuler3)

  useEffect(() => {
    const savedResponses = JSON.parse(localStorage.getItem('selectedResponses'));
    const savedQuestionIndex = parseInt(localStorage.getItem('currentQuestionIndex'), 10);
    const savedQuestions = JSON.parse(localStorage.getItem(`randomQuestions_${materialId}`));

    if (savedResponses) setSelectedResponses(savedResponses);
    if (!isNaN(savedQuestionIndex)) setCurrentQuestionIndex(savedQuestionIndex);
    if (savedQuestions) {
      setProvas([{ quests: savedQuestions }]);
    } else {
      fetchProvasData();
    }
  }, []);

  const fetchProgressProvas = async (materialId, userId) => {
    try {
        const progressProvasRef = collection(firestore, 'progressProvas');  
        
        const q = query(
            progressProvasRef,
            where("type", "==", "prova"),          
            where("userId", "==", userId),        
            where("provaId", "==", materialId)    
        );

        const querySnapshot = await getDocs(q);
        
        const progressProvasList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        console.log("Progress provas encontrados NEW:", progressProvasList);
        setProvaFinish(progressProvasList)
        console.log(progressProvasList[0].responses)
        setSelectedResponses(progressProvasList[0].responses || [])
        setLoading(false)
    } catch (error) {
        console.error("Erro ao buscar progressProvas:", error);
        setLoading(false)
    }
};

  useEffect(() => {
      fetchProgressProvas(materialId, userId);
  }, [materialId, userId]);

  const calculateRemainingTime = () => {
    const startTime = localStorage.getItem('startTime');
    if (startTime) {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      return Math.max(30 * 60 - elapsed, 0);
    }
    return 30 * 60;
  };

  const fetchProvasData = async () => {
    try {
      const provaDocRef = doc(firestore, 'provas', materialId);
      const provaDoc = await getDoc(provaDocRef);

      if (provaDoc.exists()) {
        const provaData = provaDoc.data();
        
        const randomQuestions = provaData.quests
          .sort(() => 0.5 - Math.random())
          .slice(0, 5);

        localStorage.setItem(`randomQuestions_${materialId}`, JSON.stringify(randomQuestions));
        setProvas([{ ...provaData, quests: randomQuestions }]);
      } else {
        console.error('Prova não encontrada');
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

  useEffect(() => {
    if (timeLeft === 0) {
      confirmMaterial(true);
      navigate(`/aluno/modulo/${moduloId}/aulas`);
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

  useEffect(() => {
    const savedResponses = JSON.parse(localStorage.getItem('selectedResponses'));
    console.log('Respostas salvas recuperadas:', savedResponses);
  }, []);

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

  const provaConfirm = async () => {
    try {
      const progressRef = doc(firestore, 'progressProvas', `${userId}_${materialId}`);
      let score = 0;
      const randomizedQuestions = JSON.parse(localStorage.getItem(`randomQuestions_${materialId}`));

      randomizedQuestions.forEach((quest, index) => {
        const selectedResponseIndex = selectedResponses[index];
        if (selectedResponseIndex !== undefined && quest.responses[selectedResponseIndex].value === true) {
          score += 20;
        }
      });

      score = Math.min(score, 100);
      const progressData = {
        userId,
        provaId: materialId,
        type: 'prova',
        status: 'end',
        score,
        responses: selectedResponses,
      };

      await setDoc(progressRef, progressData);
    } catch (error) {
      console.error('Erro ao salvar o progresso da prova:', error);
    }
  };

  const confirmMaterial = async (confirm) => {
    if (confirm) {
      if (materialId) {
        await provaConfirm();
        localStorage.removeItem('provas');
        localStorage.removeItem('selectedResponses');
        localStorage.removeItem('currentQuestionIndex');
        localStorage.removeItem('startTime');
        localStorage.removeItem(`randomQuestions_${materialId}`);
        navigate(`/aluno/modulo/${moduloId}/aulas`);
      }
    }
  };

  const allQuestionsAnswered = provas[0]?.quests.length === Object.keys(selectedResponses).length;

  const handleButtonClick = () => {
    if (allQuestionsAnswered) {
      confirmMaterial(true);
    }
  };

  const resultadoProva = () => {
    const score = provaFinish[0]?.score || 0;
    const aprovado = score >= 50;
  
    return (
      <div className="resultadoProva">
        <div className="titleIcon">
          <div className="divIconAula">
            <FaBookOpen />
          </div>
          <h2 className="testTitle">Nome da Prova</h2>
        </div>
        <div className="resultadoProva__status">
          {aprovado ? (
            <FaCheckCircle color="#1BA284" size={48} className="icon aprovado" />
          ) : (
            <FaTimesCircle color="#D32F2F" size={48} className="icon reprovado" />
          )}
          <p className="text-aviso">
            {aprovado
              ? 'Parabéns, você foi aprovado(a). Continue seus estudos na próxima aula.'
              : 'Você não teve a pontuação necessária. Reassista às aulas anteriores para que você possa tentar fazer a prova mais uma vez!'}
          </p>
          <p className="resultadoProva__score" style={{ backgroundColor: score < 50 ? '#D32F2F' : '#1BA284' }}>
          {score} PTS
        </p>
          <button
            className="resultadoProva__button"
            onClick={() => navigate(`/aluno/modulo/${moduloId}/aulas`)}
          >
            {aprovado ? 'Próxima aula' : 'Reassistir aulas'}
          </button>
        </div>
        <div className="perguntas_respostas">
          <ul>
            {provas[0]?.quests.map((quest, index) => {
              const selectedResponseIndex = selectedResponses[index];
              const selectedResponse =
                selectedResponseIndex !== undefined
                  ? quest.responses[selectedResponseIndex]
                  : null;
              const isCorrect = selectedResponse?.value === true;
              const isWrong = selectedResponse?.value === false;
              return (
                <li key={index}>
                  <p className="pergunta_recebida">{quest.quest}</p>
                  {selectedResponse && (
                    <div
                      className={`resposta_selecionada ${
                        isCorrect ? 'correta' : isWrong ? 'errada' : ''
                      }`}
                    >
                      <div
                        className={`circle-checkbox ${
                          isCorrect ? 'correta' : isWrong ? 'errada' : ''
                        }`}
                      >
                        <div
                          className={`circle-inner ${
                            isCorrect ? 'correta' : isWrong ? 'errada' : ''
                          }`}
                          >
                          </div>
                      </div>
                      <p title={selectedResponse.text}>
                        {selectedResponse.text.length > 140
                          ? `${selectedResponse.text.substring(0, 90)}...`
                          : selectedResponse.text}
                      </p>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
        <div className="btn_final">
          <span></span>
          <button
            className="resultadoProva__button"
            onClick={() => navigate(`/aluno/modulo/${moduloId}/aulas`)}
          >
            {aprovado ? 'Próxima aula' : 'Reassistir aulas'}
          </button>
        </div>
      </div>
    );
  };
  


  const renderProvas = () => {
    return(
      <>
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
                <ul className='testOptions' key={responseIndex} onClick={() => handleSelectResponse(currentQuestionIndex, responseIndex)}>
                  <li className='testOptionItem'>
                    <label>
                      <input
                        type='checkbox'
                        checked={selectedResponses[currentQuestionIndex] === responseIndex}
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
              {!allQuestionsAnswered && (
                <p className='msg-questions'>Responda todas as perguntas para prosseguir</p>
              )}
            </div>
          )}
        </div>
      )}
      </>
    )
  }

  useEffect(() => {
    console.log('provaFinish: ', provaFinish)
  }, [provaFinish])

  if(loading){
    return <Loading />
  }

  return (
    <div className='containerProva'>
      {provaFinish.length > 0 ? resultadoProva() : renderProvas()}
    </div>
  );
}

Prova.propTypes = {
  materialId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  contentId: PropTypes.string.isRequired,
};

export default Prova;

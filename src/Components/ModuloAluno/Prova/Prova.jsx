import { useEffect, useState } from 'react';
import './Prova.css';
import PropTypes from 'prop-types';
import { firestore } from '../../../services/firebaseConfig';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { FaBookOpen, FaCircleChevronLeft, FaCircleChevronRight } from 'react-icons/fa6';
import ButtonConfirm from '../../ButtonConfirm/ButtonConfirm';
import { useNavigate, useParams } from 'react-router-dom';

function Prova({ materialId, userId }) {
  const [provas, setProvas] = useState([]);
  const [selectedResponses, setSelectedResponses] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { moduloId } = useParams();
  const navigate = useNavigate();

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

  const provaConfirm = async (userId, provaId) => {
    try {
        // Verificar se o documento de progresso já existe
        const progressRef = doc(firestore, 'progressProvas', `${userId}_${provaId}`);
        const progressDoc = await getDoc(progressRef);

        // Calcular o score baseado nas respostas corretas
        let correctAnswers = 0;
        const totalQuestions = provas[0].quests.length;

        provas[0].quests.forEach((quest, index) => {
            const selectedResponseIndex = selectedResponses[index];
            if (selectedResponseIndex !== undefined && quest.responses[selectedResponseIndex].correct) {
                correctAnswers += 1; // Contar uma resposta correta
            }
        });

        // Calcular a pontuação final
        const score = (correctAnswers / totalQuestions) * 100;

        if (progressDoc.exists()) {
            // Atualizar o progresso existente com a nota
            await setDoc(progressRef, { status: 'end', score }, { merge: true });
            console.log('Progresso da prova atualizado com sucesso!');
        } else {
            // Criar um novo progresso com a nota
            const progressData = {
                userId: userId,
                provaId: provaId,
                status: 'end',
                score: score, // Adicionar a nota calculada
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
        provaConfirm(userId, materialId).then(() => navigate(`/aluno/modulo/${moduloId}`));
      }
    }
  };

  const allQuestionsAnswered = provas[0]?.quests.length === Object.keys(selectedResponses).length;

  const handleButtonClick = () => {
    if (allQuestionsAnswered) {
      confirmMaterial(true);
    }
  };

  try{
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
  } catch (error){
    return <p>Deu Erro</p>
  }

  
}

Prova.propTypes = {
  materialId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
};

export default Prova;

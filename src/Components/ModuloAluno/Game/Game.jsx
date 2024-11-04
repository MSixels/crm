import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { firestore } from '../../../services/firebaseConfig';
import { useNavigate, useParams } from 'react-router-dom';
import './Game.css';
import { FaCircleChevronRight } from 'react-icons/fa6';
import ButtonConfirm from '../../ButtonConfirm/ButtonConfirm';

function Game({ materialId, userId }) {
    const [gameData, setGameData] = useState(null);
    const { moduloId } = useParams();
    const navigate = useNavigate();

    useEffect(() => { 
        const fetchGameData = async () => {
            try {
                const querySnapshot = await getDocs(collection(firestore, 'aulas'));
                const aulasArray = [];
                querySnapshot.forEach((doc) => {
                    aulasArray.push({ id: doc.id, ...doc.data() });
                });
    
                const gameFiltrado = aulasArray.find(
                    (aula) => aula.id === materialId && aula.type === "game"
                );
    
                setGameData(gameFiltrado);
                console.log("Dados de game recuperados:", gameFiltrado);
            } catch (error) {
                console.error('Erro ao buscar dados de Game:', error);
            }
        };
    
        if (materialId) {
            fetchGameData();
        }
    }, [materialId]);
    

    const gameConfirm = async (userId, aulaId) => {
        try {
            const progressRef = doc(firestore, 'progressAulas', `${userId}_${aulaId}`);
            const progressDoc = await getDoc(progressRef);
            if (progressDoc.exists()) {
                await setDoc(progressRef, { status: 'end' }, { merge: true });
                console.log('Progresso atualizado com sucesso!');
            } else {
                const progressData = {
                    userId: userId,
                    aulaId: aulaId,
                    status: 'end',
                };
                await setDoc(progressRef, progressData);
                console.log('Progresso criado e atualizado com sucesso!');
            }
        } catch (error) {
            console.error('Erro ao criar ou atualizar o progresso:', error);
        }
    };

    const confirmMaterial = () => {
        if (gameData.id === materialId) {
            gameConfirm(userId, materialId).then(() => navigate(`/aluno/modulo/${moduloId}/aulas`));
        }
    };

    const handleNextActivity = () => {
        confirmMaterial()
        navigate(`/aluno/modulo/${moduloId}/aulas`);
    };

    const handlePlayNow = () => {
        if (gameData?.link) {
            console.log("Abrindo link:", gameData.link);
            window.open(gameData.link, '_blank');
        } else {
            console.warn("Link indisponível.");
        }
    };
    
    

    if (!gameData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="gameDiv">
            <h2 className="gameTitle">{gameData.name}</h2>
            <p
                className="gameDescription"
                dangerouslySetInnerHTML={{ __html: gameData.description }}
            ></p>
            <div className="btns-story">
                <ButtonConfirm
                title="Jogar agora!" 
                icon={<FaCircleChevronRight size={18} />} 
                action={handlePlayNow} 
                disabled={!gameData?.link}
                />
                <ButtonConfirm 
                    title="Próxima atividade" 
                    icon={<FaCircleChevronRight size={18} />} 
                    action={handleNextActivity}
                    disabled={false}
                />
            </div>
        </div>
    );
}

Game.propTypes = {
    materialId: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
};

export default Game;

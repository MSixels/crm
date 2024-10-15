import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../../services/firebaseConfig';
import './Game.css';
import { FaCircleChevronRight } from 'react-icons/fa6';
import ButtonConfirm from '../../ButtonConfirm/ButtonConfirm';

function Game({ materialId }) {
    const [gameData, setGameData] = useState(null);

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
                console.log("Dados filtrados de game: ", gameFiltrado);
            } catch (error) {
                console.error('Erro ao buscar dados de Game:', error);
            }
        };

        if (materialId) {
            fetchGameData();
        }
    }, [materialId]);

    if (!gameData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="gameDiv">
            <h2 className="gameTitle">{gameData.name}</h2>
            <p className="gameDescription" dangerouslySetInnerHTML={{ __html: gameData.description }}></p>
            <ButtonConfirm title='Próxima atvidade' icon={<FaCircleChevronRight size={18} />}/>
        </div>
    );
}

export default Game;

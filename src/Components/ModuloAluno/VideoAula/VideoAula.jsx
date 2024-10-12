import { useEffect, useState } from 'react';
import './VideoAula.css'
import PropTypes from 'prop-types'
import { firestore } from '../../../services/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';



function VideoAula({ materialId }) {

    const [aulas, setAulas] = useState([]);

    useEffect(() => {
        console.log('materialId: ', materialId)
        console.log("Tipo de materialId:", typeof materialId);
    
        const fetchAulasData = async () => {
            try {
                const querySnapshot = await getDocs(collection(firestore, "aulas"));
                const aulasArray = [];
                querySnapshot.forEach((doc) => {
                    aulasArray.push({ id: doc.id, ...doc.data() });
                });
    
                // Filtra a aula com id igual ao materialId
                const aulaFiltrada = aulasArray.filter(aula => aula.id === materialId);
    
                setAulas(aulaFiltrada);  // Atualiza o estado com apenas a aula filtrada
                console.log('Aula encontrada com materialId: ', aulaFiltrada);
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            }
        };
    
        if (materialId) {
            fetchAulasData();
        }
    }, [materialId]);
    
    return (
        <div className='containerVideoAula'>
            {aulas.length > 0  &&
            <div>
            <p>{aulas[0].name}</p>
            <p>{aulas[0].description}</p>
            <p>{aulas[0].videoUrl}</p>
            </div>
            }
            
        </div>
    )
}

VideoAula.propTypes = {
    materialId: PropTypes.string.isRequired,
};

export default VideoAula
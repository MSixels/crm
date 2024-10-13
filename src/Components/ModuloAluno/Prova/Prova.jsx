import { useEffect, useState } from 'react';
import './Prova.css'
import { FaBookOpen } from  'react-icons/fa';
import PropTypes from 'prop-types'
import { firestore } from '../../../services/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';



function Prova({ materialId }) {

    const [provas, setProvas] = useState([]);

    useEffect(() => {
        console.log('materialId: ', materialId)
        console.log("Tipo de materialId:", typeof materialId);
    
        const fetchProvasData = async () => {
            try {
                const querySnapshot = await getDocs(collection(firestore, "provas"));
                const provasArray = [];
                querySnapshot.forEach((doc) => {
                    provasArray.push({ id: doc.id, ...doc.data() });
                });
    
                const provaFiltrada = provasArray.filter(prova => prova.id === materialId);
    
                setProvas(provaFiltrada); 
                console.log('prova encontrada com materialId: ', provaFiltrada);
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            }
        };
    
        if (materialId) {
            fetchProvasData();
        }
    }, [materialId]);
    
    return (
        <div className='containerProva'>
            {provas.length > 0 && 
            <div>
                <div className='divIconAula'>
            <FaBookOpen />
        </div>
                <h2 className='testTitle'>{provas[0].name}</h2>
                <p>{provas[0].description} <strong>Não sei se vai ter</strong></p>
                {provas[0].quests.map((q, index) => (
                    <div  key={index} style={{marginTop: 20}}>
                        <p className='testQuestion' style={{marginBottom: 5}}>{q.quest}</p>
                        {q.responses.map((r, index) => (
                            <ul className='testOptions' key={index} style={{marginLeft: 20}}>
                                <li >{r.text}</li>
                            </ul>
                        ))}
                    </div>
                ))}
            </div>
            }
            
            
        </div>
    )
}

Prova.propTypes = {
    materialId: PropTypes.string.isRequired,
};

export default Prova
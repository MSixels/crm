import { useEffect, useState } from 'react';
import './VideoAula.css';
import PropTypes from 'prop-types';
import { firestore } from '../../../services/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import ButtonConfirm from '../../ButtonConfirm/ButtonConfirm';
import { FaCircleChevronRight } from 'react-icons/fa6';

function VideoAula({ materialId, confirmAula }) {
    const [aulas, setAulas] = useState([]);

    useEffect(() => {
        console.log('materialId: ', materialId);
        console.log("Tipo de materialId:", typeof materialId);
    
        const fetchAulasData = async () => {
            try {
                const querySnapshot = await getDocs(collection(firestore, "aulas"));
                const aulasArray = [];
                querySnapshot.forEach((doc) => {
                    aulasArray.push({ id: doc.id, ...doc.data() });
                });

                const aulaFiltrada = aulasArray.filter(aula => aula.id === materialId);
    
                setAulas(aulaFiltrada);  
                console.log('Aula encontrada com materialId: ', aulaFiltrada);
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            }
        };
    
        if (materialId) {
            fetchAulasData();
        }
    }, [materialId]);

    const proximaEtapa = (confirm) => {
        if(confirm){
            confirmAula(confirm);
        }
    };

    const getEmbedUrl = (videoUrl) => {
        const videoId = videoUrl.split('v=')[1];
        const ampersandPosition = videoId ? videoId.indexOf('&') : -1;
        return ampersandPosition !== -1 ? 
            `https://www.youtube.com/embed/${videoId.substring(0, ampersandPosition)}` : 
            `https://www.youtube.com/embed/${videoId}`;
    };
    
    return (
        <div className='containerVideoAula'>
            {aulas.length > 0 &&
                <div  className='videoAulaContent'>
                    <h2 className='contentName'>{aulas[0].name}</h2>
                    <iframe className='iframeStyle'
                        src={getEmbedUrl(aulas[0].videoUrl)}
                        title={aulas[0].name}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                    <ButtonConfirm title='Próxima etapa' icon={<FaCircleChevronRight size={25}/>} action={proximaEtapa} disabled={false} />
                    <div className="descriptionAula">
                    <p className='descriptionAula-text'>{aulas[0].description}</p>
                    </div>
                </div>
            }
        </div>
    );
}

VideoAula.propTypes = {
    materialId: PropTypes.string.isRequired,
    confirmAula: PropTypes.func.isRequired,
};

export default VideoAula;

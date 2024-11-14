import { useEffect, useState } from 'react';
import './VideoAula.css';
import PropTypes from 'prop-types';
import { firestore } from '../../../services/firebaseConfig';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import ButtonConfirm from '../../ButtonConfirm/ButtonConfirm';
import { FaCircleChevronRight } from 'react-icons/fa6';
import { useNavigate, useParams } from 'react-router-dom';

function VideoAula({ materialId, userId }) {
    const { moduloId } = useParams();
    const [aulas, setAulas] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAulasData = async () => {
            try {
                const querySnapshot = await getDocs(collection(firestore, "aulas"));
                const aulasArray = [];
                querySnapshot.forEach((doc) => {
                    aulasArray.push({ id: doc.id, ...doc.data() });
                });

                const aulaFiltrada = aulasArray.filter(aula => aula.id === materialId);
                setAulas(aulaFiltrada);
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            }
        };

        if (materialId) {
            fetchAulasData();
        }
    }, [materialId]);

    const aulaConfirm = async (userId, aulaId) => {
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
        if (aulas[0].id === materialId) {
            aulaConfirm(userId, materialId).then(() => navigate(`/aluno/modulo/${moduloId}/aulas`));
        }
    };

    const getEmbedUrl = (videoUrl) => {
        if (videoUrl && (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be'))) {
            const videoId = videoUrl.split('v=')[1];
            const ampersandPosition = videoId ? videoId.indexOf('&') : -1;
            return ampersandPosition !== -1 ? 
                `https://www.youtube.com/embed/${videoId.substring(0, ampersandPosition)}` : 
                `https://www.youtube.com/embed/${videoId}`;
        }
        return null;
    };
    
    const embedUrl = getEmbedUrl(aulas[0]?.videoUrl);
    return (
        <div className='containerVideoAula'>
            {aulas.length > 0 &&
                <div className='videoAulaContent'>
                    <h2 className='contentName'>{aulas[0].name}</h2>
                    {embedUrl ? (
                        <iframe
                            className='iframeStyle'
                            src={embedUrl}
                            title={aulas[0].name}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    ) : (
                        <button
                            className='linkButton'
                            onClick={() => window.open(aulas[0].videoUrl, '_blank')}
                        >
                            Acessar link
                        </button>
                    )}
                    
                    <div className="descriptionAula">
                        <p className='descriptionAula-text'>{aulas[0].description}</p>
                    </div>
                    <ButtonConfirm 
                        title='Concluir aula' 
                        icon={<FaCircleChevronRight size={25}/>} 
                        action={confirmMaterial} 
                        disabled={false} 
                    />
                </div>
            }
        </div>
    );
}

VideoAula.propTypes = {
    materialId: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
};

export default VideoAula;

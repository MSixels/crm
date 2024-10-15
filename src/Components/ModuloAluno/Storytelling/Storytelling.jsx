import './Storytelling.css';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../../services/firebaseConfig';
import { FaCircleChevronRight } from 'react-icons/fa6';
import ButtonConfirm from '../../ButtonConfirm/ButtonConfirm';

function StoryTelling({ materialId }) {
    const [storyData, setStoryData] = useState(null);
    const [resposta, setResposta] = useState('');
    const [charCount, setCharCount] = useState(0);
    const maxChars = 1500;

    useEffect(() => {
        const fetchStoryData = async () => {
            try {
                const querySnapshot = await getDocs(collection(firestore, 'provas'));
                const provasArray = [];
                querySnapshot.forEach((doc) => {
                    provasArray.push({ id: doc.id, ...doc.data() });
                });

                const storyFiltrada = provasArray.find(
                    (prova) => prova.id === materialId && prova.type === "storyTelling"
                );

                setStoryData(storyFiltrada);
                console.log("Dados filtrados de storyTelling: ", storyFiltrada);
            } catch (error) {
                console.error('Erro ao buscar dados de StoryTelling:', error);
            }
        };

        if (materialId) {
            fetchStoryData();
        }
    }, [materialId]);

    const handleRespostaChange = (e) => {
        const text = e.target.value;
        if (text.length <= maxChars) {
            setResposta(text);
            setCharCount(text.length);
        }
    };

    if (!storyData) {
        return <div>Loading...</div>;
    }

    return (
        <div className='storyDiv'>
            <h2 className='storyTitle'>{storyData.name}</h2>
            <p className='storyText'>{storyData.description}</p>

            <div className='storyFile'>
                <h3 className='storyH3'>Materiais</h3>
                <div className="fileList">
                    {Array.isArray(storyData.pdfUrl) ? storyData.pdfUrl.map((url, index) => (
                        <div className="fileItem" key={index}>
                            <p>PDF #{index + 1}</p>
                            <a href={url} target="_blank" rel="noopener noreferrer">
                                <button>Abrir em nova aba</button>
                            </a>
                        </div>
                    )) : (
                        <div className="fileItem">
                            <p>PDF</p>
                            <a href={storyData.pdfUrl} target="_blank" rel="noopener noreferrer">
                                <button className='btn-file'>Ver material</button>
                            </a>
                        </div>
                    )}
                </div>
            </div>

            <div className="storyResponse">
                <h3 className='storyH3'>Resposta</h3>
                <textarea
                    placeholder='Sua Resposta aqui.'
                    value={resposta}
                    onChange={handleRespostaChange}
                    maxLength={maxChars}
                ></textarea>
                <div className='charCount'>
                    {charCount}/{maxChars}
                </div>
            </div>
            <ButtonConfirm title='Próxima atvidade' icon={<FaCircleChevronRight size={18} />}/>
        </div>
    );
}

export default StoryTelling;

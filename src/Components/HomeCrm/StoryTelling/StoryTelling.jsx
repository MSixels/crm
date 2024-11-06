import { FaCirclePlus } from 'react-icons/fa6'
import ButtonBold from '../../ButtonBold/ButtonBold'
import InputText from '../../InputText/InputText'
import './StoryTelling.css'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { MdArrowBackIosNew } from 'react-icons/md'
import { GrNext } from 'react-icons/gr'
import { FaAngleDown, FaAngleUp } from 'react-icons/fa'
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import { firestore } from '../../../services/firebaseConfig'
import Loading from '../../Loading/Loading'
import { FaAngleRight } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom'

function StoryTelling({ userType }) {
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [showModalNumberPages, setShowModalNumberPages] = useState(false)
    const [loading, setLoading] = useState(true);
    const [storyTellings, setStoryTellings] = useState([])
    const [conteudos, setConteudos] = useState([])

    const header = [
        { title: 'Conteúdo' },
        { title: 'Respostas recebidas' },
    ]

    const removeAccents = (text) => {
        if (typeof text !== 'string') return '';
        return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    };

    const handleSearchChange = (newSearchTerm) => {
        setSearchTerm(newSearchTerm);
    };

    const handleNextPage = () => {
        if ((currentPage + 1) * itemsPerPage < filtered.length) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    const fetchStoryTellingFromFirestore = async () => {
        try {
            const q = query(
                collection(firestore, 'progressProvas'),
                where('type', '==', 'storyTelling')
            );
            const querySnapshot = await getDocs(q);
            const storyTellingList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                conteudoId: doc.data().conteudoId
            }));
            
            setStoryTellings(storyTellingList);
            console.log('storyTellingList', storyTellingList);
            setLoading(false);
        } catch (error) {
            console.error("Erro ao buscar storyTellings:", error);
            setLoading(false);
        }
    };

    const fetchConteudoFromFirestore = async (storyTellings) => {
        try {
            const conteudoIds = [...new Set(storyTellings.map(story => story.conteudoId))];
            console.log('conteudoIds:', conteudoIds);
            const conteudosList = [];

            for (const id of conteudoIds) {
                const docRef = doc(firestore, 'conteudo', id);
                const docSnap = await getDoc(docRef);
    
                if (docSnap.exists()) {
                    conteudosList.push({ id: docSnap.id, ...docSnap.data() });
                } else {
                    console.warn(`Documento com ID ${id} não encontrado na coleção 'conteudo'.`);
                }
            }
    
            setConteudos(conteudosList);
            console.log('conteudosList', conteudosList);
        } catch (error) {
            console.error("Erro ao buscar conteúdos:", error);
        }
    };


    useEffect(() => {
        fetchStoryTellingFromFirestore()
    }, [])

    useEffect(() => {
        fetchConteudoFromFirestore(storyTellings)
    }, [storyTellings])

    const renderModalNumberLiner = () => {
        const options = [
            {value: 40},
            {value: 20},
            {value: 10},
            {value: 5},
        ]

        return(
            <div className='containerRenderModalNumberLiner'>
                {options.map((o, index) => (
                    <div key={index} className='option' onClick={() => setItemsPerPage(o.value)}>
                        {o.value}
                    </div>
                ))}
            </div>
        )
    }
    
    
    const filtered = conteudos
    .filter(conteudo => {
        if (!searchTerm) {
            return true;
        }
        const lowerCaseSearchTerm = removeAccents(searchTerm).toLowerCase();
        return removeAccents(conteudo.name).toLowerCase().includes(lowerCaseSearchTerm);
    })
    .map(conteudo => {
        const count = storyTellings.filter(st => st.conteudoId === conteudo.id).length;
        return { conteudoId: conteudo.id, conteudoName: conteudo.name, storyTellingCount: count };
    })
    .sort((a, b) => {
        return b.storyTellingCount - a.storyTellingCount || removeAccents(a.conteudoName).localeCompare(removeAccents(b.conteudoName), 'pt', { sensitivity: 'base' });
    });
    

    const slicedStory = filtered.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    useEffect(() => {
        console.log('slicedStory: ', slicedStory)
    }, [slicedStory])

    const renderStoryTelling = () => {
        return(
            <>
                <h2 style={{ fontSize: 32}}>Storytelling</h2>
                <p style={{ fontSize: 24, fontWeight: 500, marginTop: 12 }}>Selecione na lista abaixo um conteudo para acessar as respostas</p>
                <div className='divContent'>
                    <div className='header'>
                        <div className='divInputs'>
                            <InputText title='Pesquisa por' placeH='Nome do conteudo' onSearchChange={handleSearchChange}/>
                        </div>
                        {/*userType === 1 && <ButtonBold title='Vincular aluno' icon={<FaCirclePlus size={20}/>} />*/}
                    </div>
                    <div className='divInfos'>
                        <div className='divHeader'>
                            {header.map((h, index) => (
                                <div key={index} className='title'>
                                    <span className='bold'>{h.title}</span>
                                </div>
                            ))}
                        </div>
                        {slicedStory.map((a) => {
                            return(
                                <div key={a.id} className='divConteudos'>
                                    <span className='spanBox'>{a.conteudoName ? a.conteudoName : 'Sem nome'}</span>
                                    <span className='spanBox'>{a.storyTellingCount}</span>
                                    <div className='divIconView' onClick={() => navigate(`/professor/storytelling/${a.conteudoId}`)}>
                                        <FaAngleRight />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className='legendas'>
                        <div className='divNumberLines'>
                            <p>Linhas por página <span className='bold'>{itemsPerPage}</span></p>
                            <div onClick={() => setShowModalNumberPages(!showModalNumberPages)} className='divIcon'>
                                {showModalNumberPages ? <FaAngleDown /> : <FaAngleUp />}
                                {showModalNumberPages && renderModalNumberLiner()}
                            </div>
                            
                        </div>
                        
                        <p className='bold'>{currentPage * itemsPerPage + 1}-{Math.min((currentPage + 1) * itemsPerPage, filtered.length)} de {filtered.length}</p>
                        <div className='btnNextPage'>
                            <div className='divBtnBackNext' onClick={handlePreviousPage}>
                                <MdArrowBackIosNew />
                            </div>
                            <div className='divBtnBackNext' onClick={handleNextPage}>
                                <GrNext />
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
    
    if (loading) {
        return <Loading />
    }

    return (
        <div className='containerStoryTelling'>
            {renderStoryTelling()}
        </div>
    )
}
StoryTelling.propTypes = {
    userType: PropTypes.number.isRequired,
    conteudoId: PropTypes.string.isRequired,
};

export default StoryTelling
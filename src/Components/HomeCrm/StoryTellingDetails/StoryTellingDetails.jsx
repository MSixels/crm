import './StoryTellingDetails.css'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'

import Loading from '../../Loading/Loading'
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../../../services/firebaseConfig';
import { IoMdArrowRoundBack } from "react-icons/io";
import InputText from '../../InputText/InputText';
import { useNavigate } from 'react-router-dom';

function StoryTellingDetails({ conteudoId }) {
    const navigate = useNavigate()
    const [conteudo, setConteudo] = useState(null);
    const [progressProvas, setProgressProvas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchProgressProvas = async (conteudoId) => {
        try {
            const q = query(
                collection(firestore, 'progressProvas'),
                where('type', '==', 'storyTelling'),
                where('conteudoId', '==', conteudoId)
            );

            const querySnapshot = await getDocs(q);

            const progressProvasList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            console.log('progressProvasList: ', progressProvasList)
            setProgressProvas(progressProvasList);
        } catch (error) {
            console.error("Erro ao carregar progressProvas:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchConteudo = async (conteudoId) => {
        try {
            const conteudoRef = doc(firestore, 'conteudo', conteudoId);
            const docSnap = await getDoc(conteudoRef);
            
            if (docSnap.exists()) {
                setConteudo(docSnap.data());
                
            } else {
                console.log("Conteúdo não encontrado!");
            }
        } catch (error) {
            console.error("Erro ao carregar conteúdo:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsersForStoryTellings = async (progressProvas) => {
        try {
            const userIds = [...new Set(progressProvas.map(item => item.userId))];
            console.log("User IDs:", userIds);  
    
            if (userIds.length === 0) {
                console.log('Nenhum userId encontrado nos progressProvas.');
                return [];
            }
    
            // Dividir os userIds em grupos de 30
            const userIdChunks = [];
            for (let i = 0; i < userIds.length; i += 30) {
                userIdChunks.push(userIds.slice(i, i + 30));
            }
    
            let usersList = [];
    
            // Realizar as consultas para cada chunk de userIds
            for (const chunk of userIdChunks) {
                const q = query(
                    collection(firestore, 'users'),
                    where('userId', 'in', chunk)
                );
    
                const querySnapshot = await getDocs(q);
                const chunkUsers = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
    
                usersList = [...usersList, ...chunkUsers];
            }
    
            setUsers(usersList); 
            console.log('Users: ', usersList);
        } catch (error) {
            console.error("Erro ao carregar usuários:", error);
        }
    };

    useEffect(() => {
        fetchConteudo(conteudoId);
        fetchProgressProvas(conteudoId)
    }, [conteudoId]);

    useEffect(() => {
        if (progressProvas.length > 0) {
            fetchUsersForStoryTellings(progressProvas);
        }
    }, [progressProvas]);

    const handleSearchChange = (newSearchTerm) => {
        setSearchTerm(newSearchTerm);
    };

    const removeAccents = (text) => {
        if (typeof text !== 'string') return '';
        return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    };

    const filtered = users
    .filter(user => {
        if (!searchTerm) {
            return true;
        }
        const lowerCaseSearchTerm = removeAccents(searchTerm).toLowerCase();
        return (
            removeAccents(user.name).toLowerCase().includes(lowerCaseSearchTerm) ||
            removeAccents(user.email).toLowerCase().includes(lowerCaseSearchTerm)
        );
    })
    .sort((a, b) => {
        return b.storyTellingCount - a.storyTellingCount || 
            removeAccents(a.conteudoName).localeCompare(removeAccents(b.conteudoName), 'pt', { sensitivity: 'base' });
    });

    if (loading) {
        return <Loading />;
    }

    if (!conteudo) {
        return <p>Conteúdo não encontrado!</p>;
    }

    return (
        <div className='containerStoryTellingDetails'>
            <div className='headerStory'>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12}}>
                    <div className='divIcon' onClick={() => navigate('/professor/storytelling')}>
                        <IoMdArrowRoundBack />
                    </div>
                    <h2 style={{ fontSize: 24 }}>Storytelling - {conteudo.name}</h2>
                </div>
            </div>
            <div className="storyTellingList">
                <div className='divHeaderStory'>
                    <InputText title='Pesquisa por' placeH='Nome ou email' onSearchChange={handleSearchChange}/>
                </div>
                <div className='divValues'>
                    {filtered.map((u) => {
                        const userProgressProvas = progressProvas.filter(p => p.userId === u.id);

                        return (
                            <div key={u.id} className='divStory'>
                                <div className='divUser'>
                                    <div className={`imgUserStory ${!u.avatar && 'notImg'}`}>
                                        {u.avatar ? (
                                            <img src={u.avatar} alt="" />
                                        ) : (
                                            <p style={{ fontSize: 18 }}>
                                                {u.name ? u.name[0].toUpperCase() : u.email[0].toUpperCase()}
                                            </p>
                                        )}
                                    </div>
                                    <p>{u.name ? u.name : u.email}</p>
                                </div>
                                <div>
                                    {userProgressProvas.length > 0 ? (
                                        userProgressProvas.map(p => (
                                            <div key={p.id} className="progressItem">
                                                <p >{p.response}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p>Nenhuma resposta encontrada</p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}
StoryTellingDetails.propTypes = {
    conteudoId: PropTypes.string.isRequired,
    setNull: PropTypes.func.isRequired,
};

export default StoryTellingDetails

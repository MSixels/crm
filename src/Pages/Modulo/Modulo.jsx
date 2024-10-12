import { useParams } from 'react-router-dom'
import Menu from '../../Components/ModuloAluno/Menu/Menu'
import './Modulo.css'
import Aulas from '../../Components/ModuloAluno/Aulas/Aulas'
import Header from '../../Components/Header/Header'
import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { firestore } from '../../services/firebaseConfig'

function Modulo() {
    const { moduloId } = useParams()
    const [modulo, setModulo] = useState([])
    const [conteudo, setConteudo] = useState([]);
    const [aulas, setAulas] = useState([]);
    const [provas, setProvas] = useState([]);

    const options = [
        {
            id: 1,
            text: 'início',
            route: '/aluno/home',
            status: 'active'
        },
        {
            id: 2,
            text: 'Rastreio',
            route: '/aluno/rastreio',
            status: 'active'
        },
        {
            id: 3,
            text: 'Módulos e aulas',
            route: `/aluno/modulo/${moduloId}`,
            status: 'active'
        },
    ]

    useEffect(() => {
        const fetchModulosData = async () => {
            try {
                const modulosSnapshot = await getDocs(collection(firestore, 'modulos'));
                const modulosData = modulosSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));

                // Filtrando o módulo baseado no moduloId
                const selectedModulo = modulosData.find((modulo) => modulo.id === moduloId);

                if (selectedModulo) {
                    setModulo(selectedModulo);
                    console.log("selectedModulo: ", selectedModulo); // Atualizando o estado com o módulo encontrado
                } else {
                    console.log("Módulo não encontrado.");
                }

            } catch (error) {
                console.error('Erro ao carregar modulos:', error);
            }
        };
    
        fetchModulosData();
    }, [moduloId]);

    

    useEffect(() => {
        const fetchConteudoData = async () => {
            try {
                const conteudoSnapshot = await getDocs(collection(firestore, 'conteudo'));
                const conteudoData = conteudoSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                const filteredConteudo = conteudoData.filter((c) => c.moduloId === modulo.id);

                setConteudo(filteredConteudo);
                console.log('Conteúdo filtrado: ', filteredConteudo);
            } catch (error) {
                console.error('Erro ao carregar conteúdo:', error);
            }
        };

        fetchConteudoData();
    }, [modulo]); 

    useEffect(() => {
        const fetchAulasData = async () => {
            try {
                const aulasSnapshot = await getDocs(collection(firestore, 'aulas'));
                const aulasData = aulasSnapshot.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().name,
                    conteudoId: doc.data().conteudoId,
                }));

                // Filtra aulas com conteudoId correspondente aos ids de conteudo
                const aulasFiltradas = aulasData.filter(aula => 
                    conteudo.some(c => c.id === aula.conteudoId)
                );

                setAulas(aulasFiltradas);  // Salva as aulas filtradas no estado
                console.log('Aulas filtradas: ', aulasFiltradas);
            } catch (error) {
                console.error('Erro ao carregar aulas:', error);
            }
        };

        // Só carrega as aulas se houver conteúdo carregado
        if (conteudo.length > 0) {
            fetchAulasData();
        }
    }, [conteudo]);

    useEffect(() => {
        const fetchProvasData = async () => {
            try {
                const provasSnapshot = await getDocs(collection(firestore, 'provas'));
                const provasData = provasSnapshot.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().name,
                    conteudoId: doc.data().conteudoId,
                }));

                // Filtra provas com conteudoId correspondente aos ids de conteudo
                const provasFiltradas = provasData.filter(prova => 
                    conteudo.some(c => c.id === prova.conteudoId)
                );

                setProvas(provasFiltradas);  // Salva as provas filtradas no estado
                console.log('Provas filtradas: ', provasFiltradas);
            } catch (error) {
                console.error('Erro ao carregar provas:', error);
            }
        };

        // Só carrega as provas se houver conteúdo carregado
        if (conteudo.length > 0) {
            fetchProvasData();
        }
    }, [conteudo]);

    return (
        <div className='containerModulo'>
            <Header options={options}/>
            <div className='divContent'>
                <Menu modulo={modulo} conteudo={conteudo} aulas={aulas} provas={provas}/>
                <Aulas modulo={modulo} conteudo={conteudo} aulas={aulas} provas={provas}/>
            </div>
        </div>
    )
}

export default Modulo
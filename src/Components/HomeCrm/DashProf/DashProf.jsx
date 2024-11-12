import './DashProf.css'
import DropDown from '../../DropDown/DropDown';
import InputText from '../../InputText/InputText';
import Access from '../../DashBoardComponents/Access/Access';
import Notas from '../../DashBoardComponents/Notas/Notas';
import Rastreios from '../../DashBoardComponents/Rastreios/Rastreios';
import Destaques from '../../DashBoardComponents/Destaques/Destaques';
import Loading from '../../Loading/Loading'
import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../../../services/firebaseConfig';
import { fetchModulos, fetchConteudos, fetchProvasCriadas, fetchRastreios } from '../../../functions/functions';

function DashProf() {
    const [searchDrop, setSearchDrop] = useState('Selecione');
    const [modulos, setModulos] = useState([]);
    const [conteudos, setConteudos] = useState([]);
    const [provasCriadas, setProvasCriadas] = useState([])
    const [provas, setProvas] = useState([]);
    const [filteredProvas, setFilteredProvas] = useState([]);
    const [rastreios, setRastreios] = useState([]) 
    const [loadingFiltered, setLoadingFiltered] = useState(true)
    const [loadingProvas, setLoadingProvas] = useState(true)
    const [loadingRastreios, setLoadingRastreios] = useState(true)

    useEffect(() => {
        const fetchProvas = async () => {
            try {
                const provasRef = collection(firestore, 'progressProvas');
                const q = query(provasRef, where('type', '==', 'prova'));
                const querySnapshot = await getDocs(q);
                const provasList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setProvas(provasList); 
                setLoadingProvas(false)
            } catch (error) {
                console.error('Erro ao buscar dados do Firestore:', error);
                setLoadingProvas(false)
            }
        };

        fetchModulos(setModulos);
        fetchConteudos(setConteudos);
        fetchProvasCriadas(setProvasCriadas)
        fetchProvas();
        fetchRastreios(setRastreios, setLoadingRastreios)
    }, []);

    useEffect(() => {
        if (searchDrop !== 'Selecione') {
            console.log('searchDrop: ', searchDrop);

            const filteredConteudos = conteudos.filter(conteudo => conteudo.moduloId === searchDrop);
            console.log('filteredConteudos: ', filteredConteudos);

            const filteredProvasCriadas = provasCriadas.filter(provaCriada =>
                filteredConteudos.some(conteudo => conteudo.id === provaCriada.conteudoId)
            );
            console.log('filteredProvasCriadas: ', filteredProvasCriadas);

            const filteredProvas = provas.filter(prova =>
                filteredProvasCriadas.some(provaCriada => provaCriada.id === prova.provaId)
            );
            console.log('filteredProvas: ', filteredProvas);

            setFilteredProvas(filteredProvas);
            setLoadingFiltered(false)
        } else {
            setFilteredProvas(provas); 
            setLoadingFiltered(false)
        }
    }, [searchDrop, conteudos, provas, provasCriadas]);

    const handleDropChange = (option) => {
        if (option.id) {
            setSearchDrop(option.id);
        } else {
            setSearchDrop('Selecione');
        }
    };

    if(loadingFiltered || loadingProvas || loadingRastreios){
        return <Loading />
    }

    return (
        <div className='containerDashProf'>
            <h1>Dashboard</h1>
            <div className='divInputs'>
                <div style={{ marginTop: -10 }}>
                    <InputText title='Buscar' placeH='Nome, data, informação...' />
                </div>
                <DropDown title='Módulo' type='Todos' options={modulos} onTurmaChange={handleDropChange} />
            </div>
            <div className='divBoxItens'>
                <Access />
                {filteredProvas && <Notas provas={filteredProvas} /> }
                {rastreios && <Rastreios rastreios={rastreios} weekFilter={new Date()}/>}
                
            </div>
            <div className='divBoxItens'>
                <Destaques />
            </div>
        </div>
    );
}

export default DashProf
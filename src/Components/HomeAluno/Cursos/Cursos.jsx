import './Cursos.css'
import { IoMdSearch } from "react-icons/io";
import { FaLock } from "react-icons/fa";
import { useState } from 'react';
import { GoDotFill } from "react-icons/go";
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../../ProgressBar/ProgressBar';
import { modulos } from '../../../database';

function Cursos() {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate()

    const removeAccents = (text) => {
        return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredModulos = modulos.filter(m => {
        const lowerCaseSearchTerm = removeAccents(searchTerm).toLowerCase();
        return removeAccents(m.name).toLowerCase().includes(lowerCaseSearchTerm);
    });

    const calculateProgress = (module) => {
        const percentAulas = (module.aulasFeitas / module.aulasTotal) * 100;
        const percentProvas = (module.provasFeitas / module.provasTotal) * 100;
        const percentWorkCampo = (module.workCampoFeitas / module.workCampoTotal) * 100;
    
        const totalProgress = (percentAulas + percentProvas + percentWorkCampo) / 3;
        return totalProgress.toFixed(0);
    };

    const openModulo = (id) => {
        navigate(`/aluno/${id}`)
    }

    return (
        <div className='containerCursos'>
            <header>
                <div>
                    <h2>Cursos</h2>
                    <span className='subtitle'>Acesse os conteúdos de aulas e suas provas.</span>
                </div>
                <div className='divSearch'>
                    <label htmlFor="search"><IoMdSearch size={22}/></label>
                    <input 
                        type="text" 
                        id='search' 
                        placeholder='Buscar por módulo'
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>
            </header>
            <div className='divModulos'>
                {filteredModulos.map((m) => (
                    <div key={m.id} className='divModulo'>
                        <span className='prof'>Prof: {m.prof} <GoDotFill size={12}/> Disponível até {m.timesEnd}</span>
                        <h2>{m.name}</h2>
                        <span>{m.description}</span>
                        <div className='divProgressInfos'>
                            <div className={`divInfo ${m.status === 'start' ? 'aulaStart' : m.status === 'block' ? 'aulaBlock' : m.status === 'end' ? 'aulaEnd' : ''}`}>
                                <span>{m.aulasFeitas}/{m.aulasTotal} aulas</span>
                            </div>
                            <div className={`divInfo ${m.status === 'start' ? 'provaStart' : m.status === 'block' ? 'provaBlock' : m.status === 'end' ? 'provaEnd' : ''}`}>
                                <span>{m.provasFeitas}/{m.provasTotal} provas</span>
                            </div>
                            <div className={`divInfo ${m.status === 'start' ? 'campoStart' : m.status === 'block' ? 'campoBlock' : m.status === 'end' ? 'campoEnd' : ''}`}>
                                <span>{m.workCampoFeitas}/{m.workCampoTotal} trabalhos de campo</span>
                            </div>
                        </div>
                        <div className='divProgressBar'>
                            <ProgressBar modulo={m}/>
                            <span className='progressPorcent'>{m.status !== 'block' ? `${calculateProgress(m) > 0 ? `${calculateProgress(m)}% Concluído` : 'Não iniciado'}` : (<> <FaLock /> Bloqueado</>)}</span>
                        </div>
                        <button className={`btn ${m.status === 'start' ? 'btnStart' : m.status === 'block' ? 'btnBlock' : m.status === 'end' ? 'btnEnd' : ''}`} disabled={m.status === 'block'} onClick={() => openModulo(m.id)}>
                            {m.status !== 'end' ? 'Acessar módulo' : 'Ver progresso'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Cursos
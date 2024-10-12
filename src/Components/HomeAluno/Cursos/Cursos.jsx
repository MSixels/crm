import './Cursos.css'
import { IoMdSearch } from "react-icons/io";
import { FaLock } from "react-icons/fa";
import { useState } from 'react';
import { GoDotFill } from "react-icons/go";
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../../ProgressBar/ProgressBar';
import { modulos_opcao_2, conteudo, aulas, provas } from '../../../database';

function Cursos() {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate()

    const removeAccents = (text) => {
        return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredModulos = modulos_opcao_2.filter(m => {
        const lowerCaseSearchTerm = removeAccents(searchTerm).toLowerCase();
        return removeAccents(m.name).toLowerCase().includes(lowerCaseSearchTerm);
    });

    const openModulo = (id) => {
        navigate(`/aluno/modulo/${id}`)
    }

    return (
        <div className='containerCursos'>
            <header>
                <div>
                    <h1>Módulos e aulas</h1>
                    <span className='subtitle'>Últimos módulos acessados, ou mais importantes para você.</span>
                </div>
                <div className='divSearch'>
                    <label htmlFor="search"><IoMdSearch size={22}/></label>
                    <input 
                        className='inputPesquisa'
                        type="text" 
                        id='search' 
                        placeholder='Buscar por módulo'
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>
            </header>
            <div className='divModulos'>
                {filteredModulos.map((m) => {
                    // Filtra os conteúdos que pertencem a este módulo
                    const conteudosDoModulo = conteudo.filter(c => c.moduloId === m.id);
                    
                    // Calcula o total de aulas para todos os conteúdos deste módulo
                    const totalAulasModulo = aulas.filter(a => 
                        conteudosDoModulo.some(c => c.id === a.conteudoId)
                    ).length;

                    const totalProvasModulo = provas.filter(p => 
                        conteudosDoModulo.some(c => c.id === p.conteudoId)
                    ).length
                    
                    return (
                        <div key={m.id} className='divModulo'>
                            <span className='prof'>Prof: {m.professor} <GoDotFill size={12}/> Disponível até {m.validade}</span>
                            <h3 style={{fontSize: 20}}>{m.name}</h3>
                            <span style={{fontSize: 16}}>{m.description}</span>
                            <div className='divProgressInfos'>
                                    <div className={`divInfo ${m.status === 'start' ? 'aulaStart' : m.status === 'block' ? 'aulaBlock' : m.status === 'end' ? 'aulaEnd' : ''}`}>
                                        <span>0/{totalAulasModulo} {totalAulasModulo > 1 ? 'aulas' : 'aula'}</span>
                                    </div>
                                    <div className={`divInfo ${m.status === 'start' ? 'provaStart' : m.status === 'block' ? 'provaBlock' : m.status === 'end' ? 'provaEnd' : ''}`}>
                                        <span>0/{totalProvasModulo} {totalProvasModulo > 1 ? 'provas' : 'prova'}</span>
                                    </div>
                                    
                                </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default Cursos

/*
<div className='divProgressInfos'>
                                <div className={`divInfo ${m.status === 'start' ? 'aulaStart' : m.status === 'block' ? 'aulaBlock' : m.status === 'end' ? 'aulaEnd' : ''}`}>
                                    <span>{m.aulasFeitas}/{m.aulasTotal} aulas</span>
                                </div>
                                <div className={`divInfo ${m.status === 'start' ? 'provaStart' : m.status === 'block' ? 'provaBlock' : m.status === 'end' ? 'provaEnd' : ''}`}>
                                    <span>{m.provasFeitas}/{m.provasTotal} provas</span>
                                </div>
                                <div className={`divInfo ${m.status === 'start' ? 'campoStart' : m.status === 'block' ? 'campoBlock' : m.status === 'end' ? 'campoEnd' : ''}`}>
                                    <span>{m.workCampoFeitas}/{m.workCampoTotal} rastreios</span>
                                </div>
                            </div>
                        <div className='divProgressBar'>
                            <ProgressBar modulo={m}/>
                            <span className='progressPorcent'>{m.status !== 'block' ? `${calculateProgress(m) > 0 ? `${calculateProgress(m)}% Concluído` : 'Não iniciado'}` : (<> <FaLock /> Bloqueado</>)}</span>
                        </div>
                        <button className={`btn ${m.status === 'start' ? 'btnStart' : m.status === 'block' ? 'btnBlock' : m.status === 'end' ? 'btnEnd' : ''}`} disabled={m.status === 'block'} onClick={() => openModulo(m.id)}>
                            {m.status === 'end' ? 'Ver progresso' : m.status === 'block' ? 'Em breve' : 'Acessar módulo'}
                        </button>

*/
import './RastreioPDF.css'
import PropTypes from 'prop-types'
import { 
    evaluateTDAHPotential, 
    evaluateTDIPotential, 
    evaluateTEAPotential, 
    evaluateTEAPPotential, 
    evaluateTLPotential, 
    evaluateTODPotential 
} from '../../../functions/functions';
import { useEffect, useState } from 'react';
import { FaCircleCheck } from 'react-icons/fa6';
import { questsRestreioType1, questsRestreioType2, questsRestreioType3 } from '../../../database';

function RastreioPDF({ alunoName, dataCards, dataValues }) {

    useEffect(() => {
        console.log('dataCards: ', dataCards); 
        console.log('dataValues: ', dataValues); 
    }, [dataCards, dataValues]);
    
    const header = [
        {id: 1, title: 'NOME'},
        {id: 2, title: 'FAIXA ETÁRIA'},
        {id: 3, title: 'DATA DO RASTRIEO'}, 
        {id: 4, title: 'CARACTERIZAÇÃO DE RISCO'},
        
    ]
    /*
    const headerU = [
        {id: 1, title: 'TDAH'},
        {id: 2, title: 'TEA'},
        {id: 3, title: 'TEAP'},
        {id: 4, title: 'TL'},
        {id: 5, title: 'TOD'},
        {id: 6, title: 'TDI'},
    ]
    */
    const renderGrafic = (value) => {
        return(
            <div className='containerGraficMiniPDF divlineValuePDF'>
                <div className={`bar bar-1 ${value === 'pp' ? 'green' : value === 'p' ? 'yellow' : value === 'mp' ? 'red' : ''}`}></div>
                <div className={`bar bar-2 ${value === 'pp' ? 'green' : value === 'p' ? 'yellow' : value === 'mp' ? 'red' : ''}`}></div>
                <div className={`bar bar-3 ${value === 'pp' ? '' : value === 'p' ? 'yellow' : value === 'mp' ? 'red' : ''}`}></div>
                <div className={`bar bar-4 ${value === 'pp' ? '' : value === 'p' ? '' : value === 'mp' ? 'red' : ''}`}></div>
                <div className='valueGraphText' style={{marginLeft: 8}}>
                    <p>{value === 'pp' ? 'Pouco risco potencial' : value === 'p' ? 'Médio risco potencial' : value === 'mp' ? 'Alto risco potencial' : ''}</p>
                </div>
            </div>
        )
    }

    const renderHighGrafic = (value) => {
        return(
            <div className='high divlineValue'>
                <div className={`bar bar-1 ${value === 'pp' ? 'green' : value === 'p' ? 'yellow' : value === 'mp' ? 'red' : ''}`}></div>
                <div className={`bar bar-2 ${value === 'pp' ? 'green' : value === 'p' ? 'yellow' : value === 'mp' ? 'red' : ''}`}></div>
                <div className={`bar bar-3 ${value === 'pp' ? '' : value === 'p' ? 'yellow' : value === 'mp' ? 'red' : ''}`}></div>
                <div className={`bar bar-4 ${value === 'pp' ? '' : value === 'p' ? '' : value === 'mp' ? 'red' : ''}`}></div>
                
            </div>
        )
    }

    const renderHighGraficUnic = (value) => {
        return(
            <div className='high divlineValue unicGraph newUnicGraph'>
                <div className={`bar bar-1 ${value === 'pp' ? 'green' : value === 'p' ? 'yellow' : value === 'mp' ? 'red' : ''}`}></div>
                <div className={`bar bar-2 ${value === 'pp' ? 'green' : value === 'p' ? 'yellow' : value === 'mp' ? 'red' : ''}`}></div>
                <div className={`bar bar-3 ${value === 'pp' ? '' : value === 'p' ? 'yellow' : value === 'mp' ? 'red' : ''}`}></div>
                <div className={`bar bar-4 ${value === 'pp' ? '' : value === 'p' ? '' : value === 'mp' ? 'red' : ''}`}></div>
                {/*<div className='valueGraphText'>
                    <p>{value === 'pp' ? 'Pouco provável' : value === 'p' ? 'Provável' : value === 'mp' ? 'Muito provável' : ''}</p>
                </div>*/}
            </div>
        )
    }

    function formatDateToDDMMYYYY(date) {
        const createdAtDate = new Date(date.seconds * 1000 + date.nanoseconds / 1000000);
        const day = String(createdAtDate.getDate()).padStart(2, '0'); 
        const month = String(createdAtDate.getMonth() + 1).padStart(2, '0'); 
        const year = createdAtDate.getFullYear();
        return `${day}/${month}/${year}`;
    }

    return (
        <div className='containerRastreioPDF'>
            {dataValues.length > 1 ? (
                <>
                    <h1 className='title'>Relatório de rastreios</h1>
                    <p className='subtitle'>{alunoName}</p>
                    <div className='divContentCardsPDF'>
                        <div className='divCradsPDF'>
                        {dataCards && dataCards.length > 0 ? (
                            dataCards.map((c) => (
                                <div key={c.id} className='divCardPDF'>
                                    <p className='title'>{c.title}</p>
                                    <p className='value'>
                                        <span style={{color: c.value === 0 ? '#7991a4' : '#1BA284'}}>{c.icon === 'active' ? <FaCircleCheck size={20}/> : ''}</span> 
                                        {c.value} rastreios
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p>Nenhum dado disponível</p>
                        )}
                        </div>
                    </div>
                    <div className='divValuesPDF'>
                        <p className='titleValues'>Todos os rastreios</p>
                        <div className='divContentValuesPDF'>
                            <div className='divHeaderValues'>
                                {header.map((h) => (
                                    <div key={h.id} className='divTitle'>
                                        <p className='headerTitlePDF'>{h.title}</p>
                                    </div>
                                ))}
                            </div>
                            <div className='divPatientsPDF'>
                                {dataValues.map((patient, index) => {
                                        const createdAtDate = new Date(patient.createdAt.seconds * 1000 + patient.createdAt.nanoseconds / 1000000);
                                        const day = String(createdAtDate.getDate()).padStart(2, '0'); 
                                        const month = String(createdAtDate.getMonth() + 1).padStart(2, '0'); 
                                        const year = createdAtDate.getFullYear();
                                        const formattedDate = `${day}/${month}/${year}`;

                                        const { tdahPotential } = evaluateTDAHPotential(patient.responses);
                                        const { teaPotential } = evaluateTEAPotential(patient.responses);
                                        const { teapPotential } = evaluateTEAPPotential(patient.responses);
                                        const { tlPotential } = evaluateTLPotential(patient.responses);
                                        const { todPotential } = evaluateTODPotential(patient.responses);
                                        const { tdiPotential } = evaluateTDIPotential(patient.responses);

                                        const potentials = [
                                            tdahPotential, teaPotential, teapPotential, tlPotential, todPotential, tdiPotential
                                        ];
                                        let statusCrianca = '';
                                        
                                        if (potentials.includes('mp')) {
                                            statusCrianca = 'mp';
                                        } else if (potentials.includes('p')) {
                                            statusCrianca = 'p';
                                        } else {
                                            statusCrianca = 'pp';
                                        }

                                        return (
                                            <div key={index} className='divPatientPDF'>
                                                <p className='divlineValuePDF'>{patient.patient}</p>
                                                <p className='divlineValuePDF'>
                                                    {patient.typeQuest === 1 ? '3 a 6 anos' : patient.typeQuest === 2 ? 'Até 8 anos' : patient.typeQuest === 3 ? 'Acima de 8 anos' : ''}
                                                </p>
                                                <p className='divlineValuePDF'>{formattedDate}</p> 

                                                {renderGrafic(statusCrianca)}
                                                
                                            </div>
                                        );
                                    })
                                }
                            </div>
                            
                        </div>
                    </div>
                    <div className='footer'>
                        <div className='legendas'>
                            <div className='l_graficos'>
                                <p>Pouco provável</p>
                                {renderHighGrafic('pp')}
                            </div>
                            <div className='l_graficos'>
                                <p>Provável</p>
                                {renderHighGrafic('p')}
                            </div>
                            <div className='l_graficos'>
                                <p>Muito provável</p>
                                {renderHighGrafic('mp')}
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <header style={{paddingBottom: 24, paddingTop: 24, textAlign: 'center', display: 'flex', flexDirection: 'column'}}>
                        <h3>Escala de Rastreio Rady e Borges (ERRB)</h3>
                        <p>RELATÓRIO DE RISCO POTENCIAL – RRP</p>
                    </header>
                    <p style={{paddingBlock: 18, borderBottom: 'solid 1px #ccc', borderTop: 'solid 1px #ccc'}}>Este documento contém sinais de alerta para possíveis transtornos do neurodesenvolvimento, ele não faz diagnóstico e existe a necessidade absoluta da avaliação médica de acordo com os resultados aqui observados.</p>
                    {dataValues.map((data) => (
                        <div key={data.id} style={{ paddingBlock: 16}}>
                            <p style={{display: 'flex', alignItems: 'center', gap: 8}}>Nome do aluno: <p style={{fontWeight: 500}}>{data?.patient}</p></p>
                            <p style={{display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap', flexWrap: 'nowrap'}}>Nome do professor: <p style={{fontWeight: 500}}>{alunoName}</p></p>
                            <p style={{display: 'flex', alignItems: 'center', gap: 8}}>Escola: <p style={{fontWeight: 500}}>{data?.school}</p></p>
                            <p style={{display: 'flex', alignItems: 'center', gap: 8}}>Data: <p style={{fontWeight: 500}}>{formatDateToDDMMYYYY(data?.createdAt)}</p></p>
                        </div>
                    ))}
                    <div className='divValorCrianca'>
                        <p>Caracterização de risco:</p>
                        <div className='divValuesUnicNew'> {/*divValuesUnic */}
                            {dataValues.map((patient, index) => {
                                const { tdahPotential } = evaluateTDAHPotential(patient.responses);
                                const { teaPotential } = evaluateTEAPotential(patient.responses);
                                const { teapPotential } = evaluateTEAPPotential(patient.responses);
                                const { tlPotential } = evaluateTLPotential(patient.responses);
                                const { todPotential } = evaluateTODPotential(patient.responses);
                                const { tdiPotential } = evaluateTDIPotential(patient.responses);

                                const potentials = [
                                    tdahPotential, teaPotential, teapPotential, tlPotential, todPotential, tdiPotential
                                ];
                                let statusCrianca = '';
                                
                                if (potentials.includes('mp')) {
                                    statusCrianca = 'mp';
                                } else if (potentials.includes('p')) {
                                    statusCrianca = 'p';
                                } else {
                                    statusCrianca = 'pp';
                                }

                                return (
                                    <div key={index} style={{display: 'flex', alignItems: 'center', gap: 12}}>
                                        {renderHighGraficUnic(statusCrianca)}
                                        <p style={{fontWeight: 500}}>{statusCrianca === 'pp' ? 'Baixo risco potencial de transtorno de neurodesenvolvimento' : statusCrianca === 'p' ? 'Médio risco potencial de transtorno de neurodesenvolvimento' : statusCrianca === 'mp' ? 'Alto risco potencial de transtorno de neurodesenvolvimento' : ''}</p>
                                    </div>
                                );
                            })
                            }
                        </div>
                        
                    </div>
                    <p style={{marginTop: 18}}>Descritivo</p>
                    {dataValues.map((data) => {
                        
                        const renderQuestsType1 = (questId, valueId) => {
                            return questsRestreioType1
                            .filter((q) => q.id === questId && (valueId === 2 || valueId === 3))
                            .map((q) => (
                                <div key={q.id} className='textsDiv'>
                                    <li>{q.quest}</li>
                                    {q.options
                                        .filter((o) => o.id === valueId)
                                        .map((o) => (
                                            <div key={o.id}>
                                                <p>{o.text}</p>
                                            </div>
                                        ))}
                                </div>
                            ));
                        };

                        const renderQuestsType2 = (questId, valueId) => {
                            return questsRestreioType2
                            .filter((q) => q.id === questId && (valueId === 2 || valueId === 3))
                            .map((q) => (
                                <div key={q.id} className='textsDiv'>
                                    <li>{q.quest}</li>
                                    {q.options
                                        .filter((o) => o.id === valueId)
                                        .map((o) => (
                                            <div key={o.id}>
                                                <p>{o.text}</p>
                                            </div>
                                        ))}
                                </div>
                            ));
                        };

                        const renderQuestsType3 = (questId, valueId) => {
                            console.log('dataValuesMap: ', questId + ' ' + valueId);
                            return questsRestreioType3
                            .filter((q) => q.id === questId && (valueId === 2 || valueId === 3))
                            .map((q) => (
                                <div key={q.id} className='textsDiv'>
                                    <li>{q.quest}</li>
                                    {q.options
                                        .filter((o) => o.id === valueId)
                                        .map((o) => (
                                            <div key={o.id}>
                                                <p>{o.text}</p>
                                            </div>
                                        ))}
                                </div>
                            ));
                        };

                        if(data.typeQuest === 1) {
                            return (
                                <div key={data.id} className='descritivo'>
                                    {data.responses.map((r) => (
                                        <div key={r.id}>
                                            {renderQuestsType1(r.quest, r.value)}
                                        </div>
                                    ))}
                                </div>
                            );
                        }else if(data.typeQuest === 2){
                            return (
                                <div key={data.id} className='descritivo'>
                                    {data.responses.map((r) => (
                                        <div key={r.id}>
                                            {renderQuestsType2(r.quest, r.value)}
                                        </div>
                                    ))}
                                </div>
                            );
                        }else if(data.typeQuest === 3){
                            console.log('dataResponses: ', data.responses)
                            return (
                                <div key={data.id} className='descritivo'>
                                    {data.responses.map((r) => (
                                        <div key={r.id}>
                                            {renderQuestsType3(r.quest, r.value)}
                                        </div>
                                    ))}
                                </div>
                            );
                        }

                        return null; 
                    })}
                    <p style={{ paddingBlock: 24, borderTop: 'solid 1px #ccc'}}><strong>ORIENTAÇÃO À FAMILIA</strong>: Buscar Junto a sua unidade de saúde, auxílio para encaminhamento ao serviço de referência da sua cidade, assim o diagnóstico final será feito, bem como orientações e relatórios devidamente definidos pelo médico.</p>
                </>
            )}
            
        </div>
    )
}
RastreioPDF.propTypes = {
    alunoName: PropTypes.string.isRequired,
    dataCards: PropTypes.array.isRequired,
    dataValues: PropTypes.array.isRequired,
};

export default RastreioPDF


/*
//=============================================Resultados da criança =============================//
<div className='divValuesUnic'>
    <div className='divHeaderValues_unic'>
                            {headerU.map((h) => (
                                <div key={h.id} className='divTitle'>
                                    <p className='headerTitlePDF'>{h.title}</p>
                                </div>
                            ))}
                        </div>
                        {dataValues.map((patient, index) => {
                            const { tdahPotential } = evaluateTDAHPotential(patient.responses);
                            const { teaPotential } = evaluateTEAPotential(patient.responses);
                            const { teapPotential } = evaluateTEAPPotential(patient.responses);
                            const { tlPotential } = evaluateTLPotential(patient.responses);
                            const { todPotential } = evaluateTODPotential(patient.responses);
                            const { tdiPotential } = evaluateTDIPotential(patient.responses);

                            return (
                                <div key={index} className='divPatientPDF_unic'>
                                    {renderHighGraficUnic(tdahPotential)}
                                    {renderHighGraficUnic(teaPotential)}
                                    {renderHighGraficUnic(teapPotential)}
                                    {renderHighGraficUnic(tlPotential)}
                                    {renderHighGraficUnic(todPotential)}
                                    {renderHighGraficUnic(tdiPotential)}
                                </div>
                            );
                        })
                        }
                        </div>





                        <p style={{marginTop: 18}}>Descritivo</p>
                    {dataValues.map((data) => {
                        
                        const renderQuestsType1 = (questId, valueId) => {
                            return questsRestreioType1
                            .filter((q) => q.id === questId && (valueId === 2 || valueId === 3))
                            .map((q) => (
                                <div key={q.id} className='textsDiv'>
                                    <li>{q.quest}</li>
                                    {q.options
                                        .filter((o) => o.id === valueId)
                                        .map((o) => (
                                            <div key={o.id}>
                                                <p>{o.text}</p>
                                            </div>
                                        ))}
                                </div>
                            ));
                        };

                        const renderQuestsType2 = (questId, valueId) => {
                            return questsRestreioType2
                            .filter((q) => q.id === questId && (valueId === 2 || valueId === 3))
                            .map((q) => (
                                <div key={q.id} className='textsDiv'>
                                    <li>{q.quest}</li>
                                    {q.options
                                        .filter((o) => o.id === valueId)
                                        .map((o) => (
                                            <div key={o.id}>
                                                <p>{o.text}</p>
                                            </div>
                                        ))}
                                </div>
                            ));
                        };

                        const renderQuestsType3 = (questId, valueId) => {
                            console.log('dataValuesMap: ', questId + ' ' + valueId);
                            return questsRestreioType3
                            .filter((q) => q.id === questId && (valueId === 2 || valueId === 3))
                            .map((q) => (
                                <div key={q.id} className='textsDiv'>
                                    <li>{q.quest}</li>
                                    {q.options
                                        .filter((o) => o.id === valueId)
                                        .map((o) => (
                                            <div key={o.id}>
                                                <p>{o.text}</p>
                                            </div>
                                        ))}
                                </div>
                            ));
                        };

                        if(data.typeQuest === 1) {
                            return (
                                <div key={data.id} className='descritivo'>
                                    {data.responses.map((r) => (
                                        <div key={r.id}>
                                            {renderQuestsType1(r.quest, r.value)}
                                        </div>
                                    ))}
                                </div>
                            );
                        }else if(data.typeQuest === 2){
                            return (
                                <div key={data.id} className='descritivo'>
                                    {data.responses.map((r) => (
                                        <div key={r.id}>
                                            {renderQuestsType2(r.quest, r.value)}
                                        </div>
                                    ))}
                                </div>
                            );
                        }else if(data.typeQuest === 3){
                            console.log('dataResponses: ', data.responses)
                            return (
                                <div key={data.id} className='descritivo'>
                                    {data.responses.map((r) => (
                                        <div key={r.id}>
                                            {renderQuestsType3(r.quest, r.value)}
                                        </div>
                                    ))}
                                </div>
                            );
                        }

                        return null; 
                    })}
*/
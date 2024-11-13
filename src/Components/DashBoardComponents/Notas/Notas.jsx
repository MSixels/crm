import { useEffect, useState } from 'react';
import './Notas.css';
import { GoDotFill } from "react-icons/go";
import PropTypes from 'prop-types'
import ProvaDonut from '../Graficos/ProvaDonut/ProvaDonut';

function Notas({ provas }) {
    const [media, setMedia] = useState(0);
    const [maioresQue60, setMaioresQue60] = useState(0);
    const [entre40e60, setEntre40e60] = useState(0);
    const [menoresOuIguaisA40, setMenoresOuIguaisA40] = useState(0);
    const [totalProvas, setTotalProvas] = useState(0);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        try{
            //console.log('Provas: ', provas)
            setTotalProvas(provas.length);
    
            const totalScore = provas.reduce((acc, prova) => acc + (prova.score || 0), 0);
            const mediaScore = provas.length > 0 ? totalScore / provas.length : 0;
            setMedia(mediaScore);
    
            const countMaioresQue60 = provas.filter(prova => prova.score > 60).length;
            const countEntre40e60 = provas.filter(prova => prova.score > 40 && prova.score <= 60).length;
            const countMenoresOuIguaisA40 = provas.filter(prova => prova.score <= 40).length;
    
            setMaioresQue60(countMaioresQue60);
            setEntre40e60(countEntre40e60);
            setMenoresOuIguaisA40(countMenoresOuIguaisA40);
            setLoading(false)
        } catch (error){
            //console.log('Erro Aqui Notas: ', error)
            setLoading(false)
        }
    }, [provas])

    const calcularPorcentagem = (quantidade) => {
        return totalProvas > 0 ? ((quantidade / totalProvas) * 100).toFixed(0) : 0;
    };

    if(loading){
        return <div className='containerNotas'><p>Carregando...</p></div>
    }

    return (
        <div className='containerNotas'>
            <h3 style={{marginBottom: 24}}>Provas</h3>
            <div className='divCircle'>
                <ProvaDonut maioresQue60={maioresQue60} entre40e60={entre40e60} menoresOuIguaisA40={menoresOuIguaisA40} loading={loading}/>
                <div className='divMedia'>
                    <p className='textSmall'>Média das notas geral</p>
                    <p className='valueMedia'>{media.toFixed(0)}/100</p>
                    <p className='textSmall'>em provas</p>
                </div>
            </div>
            <p style={{marginBottom: 24}}>Total de {totalProvas} provas</p>
            <div className='divLine'>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6}}>
                    <GoDotFill color='#1BA284' size={24}/>
                    <p>{`Notas > 60`}</p>
                </div>
                <p>{maioresQue60}({calcularPorcentagem(maioresQue60)}%)</p>
            </div>
            <div className='divLine'>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6}}>
                    <GoDotFill color='#EDA145' size={24}/>
                    <p>{`Notas > 40`}</p>
                </div>
                <p>{entre40e60}({calcularPorcentagem(entre40e60)}%)</p>
            </div>
            <div className='divLine'>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6}}>
                    <GoDotFill color='#D32F2F' size={24}/>
                    <p>{`Notas < ou igual 40`}</p>
                </div>
                <p>{menoresOuIguaisA40}({calcularPorcentagem(menoresOuIguaisA40)}%)</p>
            </div>
        </div>
    );
}
Notas.propTypes = {
    provas: PropTypes.array.isRequired,
};

export default Notas;
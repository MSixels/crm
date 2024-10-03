import './Rastreios.css'
import ButtonBold from '../../ButtonBold/ButtonBold'
import { FaCirclePlus } from 'react-icons/fa6'
import { useEffect, useState } from 'react'
import ModalCreateRastreio from '../../ModalCreateRastreio/ModalCreateRastreio'
import PropTypes from 'prop-types'
import { FaCircleCheck } from "react-icons/fa6";
import RastreiosConcluidos from '../RastreiosConcluidos/RastreiosConcluidos'

function Rastreios({ data }) {
    const [showModal, setShowModal] = useState(false)
    const [rastreioCounts, setRastreioCounts] = useState({
        total: 0,
        typeQuest1: 0,
        typeQuest2: 0,
        typeQuest3: 0,
    });

    useEffect(() => {
        if (data) {
            try{
                console.log('Data useEffect: ', data[0])
                const rastreiosArray = data[0];
                const total = rastreiosArray.length;
                //console.log(total)
                const typeQuest1 = rastreiosArray.filter(rastreio => rastreio.typeQuest === 1).length;
                const typeQuest2 = rastreiosArray.filter(rastreio => rastreio.typeQuest === 2).length;
                const typeQuest3 = rastreiosArray.filter(rastreio => rastreio.typeQuest === 3).length;
        
                setRastreioCounts({
                    total,
                    typeQuest1,
                    typeQuest2,
                    typeQuest3,
                });
                
            }catch{
                console.log('deu erro')
            }
            
        } else {
            console.error('Expected data to be an array or an object, but got:', data);
            setRastreioCounts({
                total: 0,
                typeQuest1: 0,
                typeQuest2: 0,
                typeQuest3: 0,
            });
        }
    }, [data]);

    const clickBtn = (openModal) => {
        setShowModal(openModal);
    }

    const closeBtn = (close) => {
        setShowModal(close);
    }

    const cards = [
        { id: 1, icon: <FaCircleCheck color='#1BA284' size={32}/>, title: 'Concluídos', value: rastreioCounts.total },
        { id: 2, icon: '', title: '3 a 6 anos', value: rastreioCounts.typeQuest1 },
        { id: 3, icon: '', title: 'Até 8 anos', value: rastreioCounts.typeQuest2 },
        { id: 4, icon: '', title: 'Acima de 8 anos', value: rastreioCounts.typeQuest3 },
    ];

    return (
        <div className='containerRastreios'>
            {showModal && <ModalCreateRastreio title='Novo rastreio' close={closeBtn}/> }
            <header>
                <div>
                    <h1>Rastreios</h1>
                    <span className='subtitle'>Inicie um novo rastreio ou veja os que já foram concluídos</span>
                </div>
                <ButtonBold title='Iniciar novo rastreio' icon={<FaCirclePlus size={20}/>} action={clickBtn} />
            </header>
            <div className='divCrads'>
                {cards.map((c) => (
                    <div key={c.id} className='divCard'>
                        <p className='title'>{c.title}</p>
                        <p className='value'>{c.icon} {c.value} {c.value > 1 ? 'rastreios' : 'rastreio'}</p>
                    </div>
                ))}
            </div>
            <RastreiosConcluidos data={data}/>
        </div>
    );
}

Rastreios.propTypes = {
    data: PropTypes.array.isRequired,
};

export default Rastreios;

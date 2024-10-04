import './RastreiosSmall.css'
import ButtonBold from '../../ButtonBold/ButtonBold'
import { FaCirclePlus } from 'react-icons/fa6'
import { useEffect, useState } from 'react'
import ModalCreateRastreio from '../../ModalCreateRastreio/ModalCreateRastreio'
import PropTypes from 'prop-types'
import { FaCircleCheck } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom'

function RastreiosSmall({ data }) {
    const navigate = useNavigate()
    const [showModal, setShowModal] = useState(false)
    const [rastreioCounts, setRastreioCounts] = useState({
        total: 0,
        typeQuest1: 0,
        typeQuest2: 0,
        typeQuest3: 0,
    });

    useEffect(() => {
        if (data) {
            //console.log(data[0])
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
    ];

    return (
        <div className='containerRastreios'>
            {showModal && <ModalCreateRastreio title='Novo rastreio' close={closeBtn}/> }
            <header>
                <div>
                    <h1>Rastreios</h1>
                    <span className='subtitle'>Inicie um novo rastreio ou veja os que já foram concluídos</span>
                </div>
                
            </header>
            <div className='divCrads'>
                {cards.map((c) => (
                    <div key={c.id} className='divCard' onClick={() => navigate('/aluno/rastreio')}>
                        <p className='title'>{c.title}</p>
                        <p className='value'>{c.icon} {c.value} rastreios</p>
                    </div>
                ))}
                <ButtonBold title='Iniciar novo rastreio' icon={<FaCirclePlus size={20}/>} action={clickBtn} />
            </div>
        </div>
    );
}

RastreiosSmall.propTypes = {
    data: PropTypes.array.isRequired,
};

export default RastreiosSmall;

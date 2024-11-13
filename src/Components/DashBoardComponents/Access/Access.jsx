import { useEffect, useState } from 'react';
import AccessGrafico from '../Graficos/AccessGrafico/AccessGrafico';
import './Access.css'
import { FaAngleLeft } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa6";
import { fetchAccess } from '../../../functions/functions';
import LoadingItem from '../../LoadingItem/LoadingItem';

function Access() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [ totalAccess, setTotalAccess] = useState(null)

    const [access, setAccess] = useState([])
    const [loadingAccess, setLoadingAccess] = useState(true)
    useEffect(() => {
        fetchAccess(setAccess, setLoadingAccess)
    }, [])

    const thirtyDaysAgo = new Date(currentDate);
    thirtyDaysAgo.setDate(currentDate.getDate() - 6);

    const formattedCurrentDate = currentDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    const formattedThirtyDaysAgo = thirtyDaysAgo.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });

    const handleNextWeek = () => {
        const nextWeek = new Date(currentDate);
        nextWeek.setDate(currentDate.getDate() + 6);
        setCurrentDate(nextWeek);
    };

    const handlePrevWeek = () => {
        const prevWeek = new Date(currentDate);
        prevWeek.setDate(currentDate.getDate() - 6);
        setCurrentDate(prevWeek);
    };

    if(loadingAccess){
        return <div className='containerAccess'><LoadingItem /></div>
    }

    return (
        <div className='containerAccess'>
            <h3 style={{ width: '100%', textAlign: 'center'}}>Acessos semanais</h3>
            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                    <div style={{ cursor: 'pointer' }} onClick={handlePrevWeek}>
                        <FaAngleLeft />
                    </div>
                    <span>{formattedCurrentDate}</span>
                    <div style={{ cursor: 'pointer' }} onClick={handleNextWeek}>
                        <FaAngleRight />
                    </div>
                </div>
                <p style={{ fontSize: 12 }}>{formattedThirtyDaysAgo} a {formattedCurrentDate}</p>
            </div>
            <AccessGrafico
                access={access}
                loading={loadingAccess}
                dayAgo={thirtyDaysAgo}
                day={currentDate}
                acessosTotal={setTotalAccess}
            />
            <div className='divTotalAccess'>
                <h3>{totalAccess}</h3>
                <p>acessos nesses 7 dias</p>
            </div>
        </div>
    );
}

export default Access
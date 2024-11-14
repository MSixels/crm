import { useEffect, useState } from 'react';
import './Rastreios.css';
import PropTypes from 'prop-types';
import { GrEdit } from "react-icons/gr";
import RastreioDonut from '../Graficos/RastreioDonut/RastreioDonut';
import RastreioSpark from '../Graficos/RastreioSpark/RastreioSpark';
import { IoMdArrowRoundUp } from "react-icons/io";

function Rastreios({ rastreios, weekFilter }) {
    const [total, setTotal] = useState(0);
    const [weeklyData, setWeeklyData] = useState([]);
    const [weeklyLabels, setWeeklyLabels] = useState([]);

    useEffect(() => {
        setTotal(rastreios.length);
        
        const today = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 6);

        const groupedByWeek = groupRastreiosByWeek(rastreios, sevenDaysAgo, today);
        setWeeklyData(groupedByWeek.counts);
        setWeeklyLabels(groupedByWeek.labels);
        
        //console.log('rastreios: ', rastreios);
        //console.log('weeklyData: ', groupedByWeek.counts);
    }, [rastreios, weekFilter]);

    const groupRastreiosByWeek = (rastreios, startDate) => {
        const counts = Array(7).fill(0); 
        const labels = [];
        
        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            const dayLabel = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`;
            labels.push(dayLabel);

            rastreios.forEach(rastreio => {
                const createdAtDate = rastreio.createdAt.toDate();
                if (
                    createdAtDate.getDate() === currentDate.getDate() &&
                    createdAtDate.getMonth() === currentDate.getMonth() &&
                    createdAtDate.getFullYear() === currentDate.getFullYear()
                ) {
                    counts[i] += 1;
                }
            });
        }

        return { counts, labels };
    };

    return (
        <div className='containerRastreiosDash'>
            <div className='divBox'>
                <h3 style={{ marginBottom: 24 }}>Rastreios</h3>
                <div className='divCircle'>
                    <RastreioDonut total={total}/>
                    <div className='divCount'>
                        <div className='divIcon'>
                            <GrEdit size={22}/>
                        </div>
                        <p className='value'>{total}</p>
                        <p className='textSmall'>concluídos</p>
                    </div>
                </div>
            </div>
            <div className='divBox'>
                <h3 style={{ marginBottom: 24, width: '100%' }}>Novos rastreios</h3>
                <div className='values'>
                    <div className='sparkline'>
                        {weeklyData && weeklyLabels && <RastreioSpark weeklyData={weeklyData} weeklyLabels={weeklyLabels}/>}
                    </div>
                    <div>
                        <h3>{weeklyData ? weeklyData.reduce((acc, curr) => acc + curr, 0) : 0} <IoMdArrowRoundUp color='#1BA284'/></h3>
                        <p>Últimos 7 dias</p>
                    </div>
                </div>
                
            </div>
        </div>
    );
}

Rastreios.propTypes = {
    rastreios: PropTypes.array.isRequired,
    weekFilter: PropTypes.any.isRequired,  
    
};

export default Rastreios;

/*



*/
import ReactApexChart from "react-apexcharts"
import PropTypes from 'prop-types';

function RastreioDonut({ total }) {

    const chartOptions = {
        chart: {
            type: 'donut',
        },
        labels: ['Concluídos', 'Limite de'],
        colors: ['#1BA284', '#EDA145'],
        dataLabels: {
            enabled: false, 
        },
        legend: {
            show: false,
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '85%',
                    width: '20%', 
                },
                endAngle: 120,
                startAngle: -120,
            }
        },
        stroke: {
            show: true,
            colors: '#FFF', 
            width: 2, 
        },
        
    };

    const chartData = [total, 5000 - total];

    return (
        <>
            <ReactApexChart 
                options={chartOptions} 
                series={chartData}
                type="donut" 
                width="100%" 
                height="100%" 
            />
        </>
    )
}

RastreioDonut.propTypes = {
    total: PropTypes.number.isRequired,
};

export default RastreioDonut
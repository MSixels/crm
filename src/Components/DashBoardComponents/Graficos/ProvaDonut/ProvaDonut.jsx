import ReactApexChart from "react-apexcharts"
import PropTypes from 'prop-types';

function ProvaDonut({ maioresQue60, entre40e60, menoresOuIguaisA40}) {

    const chartOptions = {
        chart: {
            type: 'donut',
        },
        labels: ['Notas > 60', 'Notas = 60', 'Notas < ou igual 40'],
        colors: ['#1BA284', '#EDA145', '#D32F2F'],
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
                startAngle: 270,
                endAngle: -90,
            }
            
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    };

    const chartSeries = [maioresQue60, entre40e60, menoresOuIguaisA40];
    return (
        <>
            <ReactApexChart 
                options={chartOptions} 
                series={chartSeries} 
                type="donut" 
                width="100%" 
                height="100%" 
            />
        </>
    )
}

ProvaDonut.propTypes = {
    maioresQue60: PropTypes.number.isRequired,
    entre40e60: PropTypes.number.isRequired,  
    menoresOuIguaisA40: PropTypes.number.isRequired, 
};

export default ProvaDonut
import ReactApexChart from "react-apexcharts"
import PropTypes from 'prop-types';

function RastreioSpark({ weeklyData, weeklyLabels }) {

    const sparkChartOptions = {
        chart: {
            id: 'sparkline1',
            type: 'line',
            sparkline: {
                enabled: true, 
            },
            group: 'sparklines',
        },
        series: [{
            name: 'Rastreios',
            data: weeklyData,
        }],
        stroke: {
            curve: 'smooth',
            width: 2,
        },
        markers: {
            size: 0,
            hover: {
                size: 4, 
            },
        },
        tooltip: {
            enabled: true,
            x: {
                show: false, // Oculta o valor do eixo X no tooltip
            },
            y: {
                formatter: (value) => `${value}`, 
                title: {
                    formatter: () => '' 
                }
            },
            marker: {
                show: true, // Mostra apenas o número no ponto
            },
            style: {
                fontSize: '12px',
            },
            fixed: {
                enabled: false,
            },
        },
        colors: ['#1BA284'],
    };

    return (
        <>
            <ReactApexChart 
                options={sparkChartOptions} 
                series={sparkChartOptions.series}
                type="line" 
                width="100%" 
                height="100%" 
            />
        </>
    )
}

RastreioSpark.propTypes = {
    weeklyData: PropTypes.array.isRequired,
    weeklyLabels: PropTypes.any.isRequired,
};

export default RastreioSpark
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
                formatter: ({ dataPointIndex }) => weeklyLabels[dataPointIndex],
            },
            y: {
                formatter: (value) => `${value} rastreios`, 
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
    weekFilter: PropTypes.any.isRequired,
    weeklyData: PropTypes.array.isRequired,
    weeklyLabels: PropTypes.any.isRequired,
};

export default RastreioSpark
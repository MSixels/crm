import ReactApexChart from 'react-apexcharts';
import PropTypes from 'prop-types';
import { useMemo } from 'react';


function AccessGrafico({ access, loading, dayAgo, day }) {
    const chartData = useMemo(() => {
        //console.log('ACCESS: ', access);
        //console.log('dayAgo: ', dayAgo);
        //console.log('day: ', day);
        
        const startDate = new Date(dayAgo);  
        const endDate = new Date(day);       

        //console.log('startDate: ', startDate);
        //console.log('endDate: ', endDate);

        const dailyAccessData = access.reduce((acc, item) => {
            const date = new Date(item.createdAt.seconds * 1000); 
            const dayStartTimestamp = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
            acc[dayStartTimestamp] = (acc[dayStartTimestamp] || 0) + 1; 
            return acc;
        }, {});

        const generateDates = (startDate, endDate) => {
            const dates = [];
            let currentDate = new Date(startDate);  
            while (currentDate <= endDate) {
                const timestamp = new Date(currentDate).setHours(0, 0, 0, 0); 
                const totalAccess = dailyAccessData[timestamp] || 0; 
                dates.push([timestamp, totalAccess]);

                currentDate.setDate(currentDate.getDate() + 1); 
            }
            return dates;
        };

        const seriesData = generateDates(startDate, endDate);
        //console.log('seriesData: ', seriesData);

        return {
            series: [{
                data: seriesData
            }],
            options: {
                chart: {
                    id: 'area-datetime',
                    type: 'area',
                    width: '100%',
                    toolbar: { show: false }
                },
                colors: ['#222D7E'],
                dataLabels: { enabled: false },
                markers: { size: 0, style: 'hollow' },
                xaxis: {
                    type: 'datetime',
                    labels: { show: false },
                    axisBorder: { show: false },
                    axisTicks: { show: false }
                },
                yaxis: {
                    labels: { show: false },
                    axisBorder: { show: false },
                    axisTicks: { show: false }
                },
                grid: { show: false },
                tooltip: {
                    x: {
                        show: false  
                    },
                    y: {
                        title: {
                            formatter: () => '' 
                        },
                        formatter: (value) => `${value} acessos` 
                    }
                },
                fill: {
                    type: 'gradient',
                    gradient: {
                        shadeIntensity: 1,
                        opacityFrom: 0.7,
                        opacityTo: 0.9,
                        stops: [0, 100]
                    }
                },
            }
        };
    }, [access, dayAgo, day]);

    if (loading) {
        return <p>Carregando...</p>;
    }

    return (
        <>
            <ReactApexChart 
                options={chartData.options} 
                series={chartData.series} 
                type="area" 
                width="100%" 
                height="220" 
            />
        </>
    );
}
AccessGrafico.propTypes = {
    access: PropTypes.array,
    loading: PropTypes.bool,
    dayAgo: PropTypes.any,
    day: PropTypes.any,
};

export default AccessGrafico
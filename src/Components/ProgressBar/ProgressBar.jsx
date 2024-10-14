import './ProgressBar.css'
import PropTypes from 'prop-types'

function ProgressBar({aulasCompletadas, aulasTotal, provasCompletadas, provasTotal}) {
    const calculateProgress = (aulasCompletadas, aulasTotal, provasCompletadas, provasTotal) => {
        const percentAulas = (aulasCompletadas / aulasTotal) * 100;
        const percentProvas = (provasCompletadas / provasTotal) * 100;

        const totalProgress = (percentAulas + percentProvas) / 2; 
        return totalProgress.toFixed(0); 
    };

    const progressPercentage = calculateProgress(aulasCompletadas, aulasTotal, provasCompletadas, provasTotal);
    
    return (
        <div className={`boxBar ${aulasCompletadas < aulasTotal || provasCompletadas < provasTotal ? 'boxBarStart'  : aulasCompletadas === aulasTotal && provasCompletadas === provasTotal ? 'boxBarEnd' : 'boxBarStart'}`}>
            <div className="bar" style={{ width: `${progressPercentage}%` }}></div>
        </div>
    )
}
ProgressBar.propTypes = {
    aulasCompletadas: PropTypes.number.isRequired,
    aulasTotal: PropTypes.number.isRequired,
    provasCompletadas: PropTypes.number.isRequired,
    provasTotal: PropTypes.number.isRequired,
};

export default ProgressBar
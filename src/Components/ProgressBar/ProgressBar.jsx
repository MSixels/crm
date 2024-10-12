import './ProgressBar.css'
import PropTypes from 'prop-types'

function ProgressBar({modulo}) {
    const calculateProgress = (module) => {
        const percentAulas = (module.aulasFeitas / module.aulasTotal) * 100;
        const percentProvas = (module.provasFeitas / module.provasTotal) * 100;
        const percentWorkCampo = (module.workCampoFeitas / module.workCampoTotal) * 100;
    
        const totalProgress = (percentAulas + percentProvas + percentWorkCampo) / 3;
        return totalProgress.toFixed(0);
    };
    
    return (
        <div className={`boxBar ${modulo.status === 'start' ? 'boxBarStart' : modulo.status === 'block' ? 'boxBarBlock' : modulo.status === 'end' ? 'boxBarEnd' : ''}`}>
            <div className='bar' style={{width: `${calculateProgress(modulo)}%`}}></div>
        </div>
    )
}
ProgressBar.propTypes = {
    modulo: PropTypes.array.isRequired
};

export default ProgressBar
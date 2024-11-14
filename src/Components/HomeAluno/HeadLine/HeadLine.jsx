import './HeadLine.css'
import { FaPlay } from "react-icons/fa";

import PropTypes from 'prop-types';

function HeadLine({userName}) {
    
  return (
    <div className='containerHeadLine'>
      <h1>Olá, {userName}</h1>
    </div>
  )
}
HeadLine.propTypes = {
  userName: PropTypes.string.isRequired,
};

export default HeadLine
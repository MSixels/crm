import './DashProf.css'
import DropDown from '../../DropDown/DropDown';
import { modulos, turmas } from '../../../database';
import InputText from '../../InputText/InputText';

function DashProf() {
    return(
        <div className='containerDashProf'>
            <h1>Dashboard</h1>
            <div className='divInputs'>
                <InputText title='Buscar' placeH='Nome, data, informação...'/>
                <DropDown title='Módulo' type='Todos' options={modulos}/>
                <DropDown title='Turma(s)' type='Todas' options={turmas}/>
            </div>
        </div>
    )
}

export default DashProf
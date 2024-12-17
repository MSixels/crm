import { useEffect, useRef, useState } from 'react';
import ButtonConfirm from '../../ButtonConfirm/ButtonConfirm'
import InputText from '../../InputText/InputText'
import './ModalCertificado.css'
import InputCPF from '../../InputCPF/InputCPF';
import InputNumber from '../../InputNumber/InputNumber';
import ButtonBold from '../../ButtonBold/ButtonBold';
import Fundo from '../../../imgs/fundo_certificado.png'
import Logo from '../../../imgs/logo.png'
import Assinatura from '../../../imgs/assinatura.png'
import Img_1 from '../../../imgs/pccn_certificado.png'
import Img_2 from '../../../imgs/tocantins_certificado.png'
import Img_3 from '../../../imgs/profe_certificado.png'
import html2pdf from 'html2pdf.js';
import { fetchCertificado, generateCertificado, updateUserCertificado } from '../../../functions/functions';
import PropTypes from 'prop-types'

function ModalCertificado({ userId }) {
    const [name, setName] = useState('')
    const [cpf, setCpf] = useState('')
    const [matricula, setMatricula] = useState('')
    const [done, setDone] = useState(false)
    const componentRef = useRef();
    const [certificado, setCertificado] = useState({})

    useEffect(() => {
        if(userId){
            fetchCertificado(userId, setCertificado)
        }
    }, [userId])

    useEffect(() => {
        if (certificado && Object.keys(certificado).length > 0) {
            setName(certificado.name);
            setCpf(certificado.cpf);
            setDone(true);
        }
    }, [certificado]);

    const generate = () => {
        generateCertificado(userId, name, cpf, fetchCertificado(userId, setCertificado))
        updateUserCertificado(userId, name, matricula, cpf)
    }

    const baixarPDF = (confirm) => {
        if (confirm) {
            const element = componentRef.current;
    
            const width = element.offsetWidth;
            const height = element.offsetHeight;
    
            const opt = {
                margin: 0,
                filename: 'certificado_pccn.pdf',
                image: { type: 'png', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
                jsPDF: { 
                    unit: 'px', 
                    format: [width, height], 
                    orientation: 'landscape' 
                },
            };
    
            html2pdf().from(element).set(opt).save();
        }
    };

    const renderModal = () => {
        return(
            <div className='divBox'>
                <p className='title'>Informe seus dados</p>
                <p style={{marginBottom: 12}}>Esses dados serão utilizados para registro e emissão de certificado, e não poderão ser alterados</p>
                <div>
                    <InputText title='Nome completo' onSearchChange={setName}/>
                </div>
                <div>
                    <InputCPF title='CPF' onSearchChange={setCpf}/>
                </div>
                <div style={{marginBottom: 12}}>
                    <InputNumber title='Número de matrícula' onSearchChange={setMatricula}/>
                </div>
                <ButtonConfirm title='Continuar' action={generate} disabled={name === '' || cpf === '' || matricula === ''}/>
            </div>
        )
    }

    const renderCertificado = () => {
        return(
            <div className='divCertificado'>
                <header>
                    <h1>Certificado de Conclusão</h1>
                    <ButtonBold title='Fazer Download' action={baixarPDF}/>
                </header>
                <div ref={componentRef} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <div  className='certificado' style={{backgroundImage: `url(${Fundo})`, backgroundSize: 'cover', backgroundPosition: 'center', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24}}>
                        <div className='divContent' style={{padding: 24, backgroundColor: '#FFF', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', paddingInline: 142, textAlign: 'center'}}>
                            <img src={Logo} alt="" />
                            <div className='divTitle' style={{display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBlock: 6, paddingInline: 12, border: 'solid 2px #FDB415', marginTop: 12, marginBottom: 24}}>
                                <p style={{fontSize: 28, fontWeight: 500, color: '#FDB415', letterSpacing: 2}}>CERTIFICADO</p>
                            </div>
                            <p>A Ultra Cursos, CNPJ 23.284.700/0001-50, afirma por meio deste documento que </p>
                            <p style={{ fontSize: 24, fontWeight: 500, textTransform: 'uppercase', paddingBlock: 12}} className='userName'>{name}</p>
                            <p>portador do CPF <span style={{fontWeight: 'bold'}}>{cpf}</span> concluiu com êxito o PROGRAMA DE CAPACITAÇÃO CONTINUADA EM NEUROEDUCAÇÃO (PCCN) realizado de modo híbrido, com carga horária total de 60 horas. Período 29 de outubro de 2024, à 06 de dezembro de 2024.</p>
                            <div className='divAssinar' style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginTop: 84}}>
                                <div style={{position: 'relative'}}>
                                    <img src={Assinatura} alt="" style={{ width: 200, position: 'absolute', top: -50, left: 20 }}/>
                                    <p style={{width: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', borderTop: 'solid 1px #000', padding: 6}}>Ultra Cursos</p>
                                </div>
                                <p style={{width: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', borderTop: 'solid 1px #000', padding: 6}}>Aluno</p>
                            </div>
                            <div className='divEmpresas' style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 64, width: '100%', gap: 12}}>
                                <img src={Img_1} alt="" style={{height: 50}} />
                                <img src={Img_2} alt="" style={{height: 50}} />
                                <img src={Img_3} alt="" style={{height: 50}} />
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        )
    }
    
    return (
        <div className='containerModalCertificado'>
            {done ? renderCertificado() : renderModal()}
        </div>
    )
}
ModalCertificado.propTypes = {
    userId: PropTypes.string.isRequired,
};

export default ModalCertificado
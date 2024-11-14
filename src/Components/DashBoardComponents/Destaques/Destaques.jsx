import { useEffect, useState } from 'react';
import './Destaques.css';
import PropTypes from 'prop-types';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../../../services/firebaseConfig';
import { GrEdit } from 'react-icons/gr';
import { FaBookOpen } from "react-icons/fa";

function Destaques({ provas, rastreios }) {
  const [alunosDestaque, setAlunosDestaque] = useState([]);
  const [detalhesAlunos, setDetalhesAlunos] = useState([]);

  function encontrarTopAlunos(provas, rastreios) {
    const mediaScores = {};
    provas.forEach(prova => {
      const { userId, score } = prova;
      if (!mediaScores[userId]) {
        mediaScores[userId] = { totalScore: 0, count: 0 };
      }
      mediaScores[userId].totalScore += score;
      mediaScores[userId].count += 1;
    });

    const medias = Object.entries(mediaScores).map(([userId, { totalScore, count }]) => ({
      userId,
      mediaScore: totalScore / count
    }));

    const rastreiosCount = {};
    rastreios.forEach(rastreio => {
      const { userId } = rastreio;
      if (!rastreiosCount[userId]) {
        rastreiosCount[userId] = 0;
      }
      rastreiosCount[userId] += 1;
    });

    medias.sort((a, b) => {
      if (b.mediaScore !== a.mediaScore) {
        return b.mediaScore - a.mediaScore;
      }
      const rastreiosA = rastreiosCount[a.userId] || 0;
      const rastreiosB = rastreiosCount[b.userId] || 0;
      return rastreiosB - rastreiosA;
    });

    const top5Alunos = medias.slice(0, 6).map(aluno => ({
      userId: aluno.userId,
      media: aluno.mediaScore,
      qtdRastreios: rastreiosCount[aluno.userId] || 0
    }));

    return top5Alunos;
  }

  async function buscarDetalhesUsuarios(alunosDestaque) {
    const userIds = alunosDestaque.map(aluno => aluno.userId);
    const usersRef = collection(firestore, 'users');
    const q = query(usersRef, where('userId', 'in', userIds));

    try {
      const querySnapshot = await getDocs(q);
      const usuarios = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDetalhesAlunos(usuarios);
    } catch (error) {
      //console.error("Erro ao buscar detalhes dos usuários:", error);
    }
  }

  useEffect(() => {
    const top5Alunos = encontrarTopAlunos(provas, rastreios);
    setAlunosDestaque(top5Alunos);
  }, [provas, rastreios]);

  useEffect(() => {
    if (alunosDestaque.length > 0) {
      buscarDetalhesUsuarios(alunosDestaque);
    }
  }, [alunosDestaque]);

  const getInitial = (name, email) => {
    const displayName = name || email;
    return displayName ? displayName.charAt(0).toUpperCase() : '';
  };

  return (
    <div className='containerDestaques'>
      <h2>Destaques</h2>
      <div className='divUsers'>
        {alunosDestaque.map((aluno, index) => {
          const alunoDetalhes = detalhesAlunos.find(a => a.userId === aluno.userId);

          if (!alunoDetalhes) {
            return (
              <div key={index} className='divItem'>
                <div className='divUser'>
                  <div>
                    <span>Carregando...</span>
                  </div>
                </div>
                <p>Carregando dados do aluno...</p>
                <p>Media: {aluno.media}</p>
                <p>Rastreios: {aluno.qtdRastreios}</p>
              </div>
            );
          }

          return (
            <div key={index} className='divItem'>
                <div className='divUser'>
                    <div>
                        {alunoDetalhes.avatar ? (
                            <div className='divAvatar'>
                                <img src={alunoDetalhes.avatar} alt="" />
                            </div>
                        ) : (
                            <div className='divInitial'>
                                <span>{getInitial(alunoDetalhes.name, alunoDetalhes.email)}</span>
                            </div>
                        )}
                    </div>
                    <p style={{fontSize: 14}}>{alunoDetalhes ? (alunoDetalhes.name || alunoDetalhes.email) : 'Carregando dados do aluno...'}</p>
                </div>
                <div className='divInfos bb mt'>
                    <div className='divIcon'>
                        <GrEdit size={12}/>
                    </div>
                    <p>{aluno.qtdRastreios} rastreios concluídos</p>
                </div>
                <div className='divInfos'>
                    <div className='divIcon'>
                        <FaBookOpen size={12}/>
                    </div>
                    <p>{aluno.media}/100 média em provas</p>
                </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

Destaques.propTypes = {
  provas: PropTypes.array,
  rastreios: PropTypes.array,
};

export default Destaques;

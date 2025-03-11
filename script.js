
// import csv from 'csvtojson';
// import { addDoc, collection } from 'firebase/firestore';
// import {firestore} from './src/services/firebaseConfig.js'

// const csvFilePath = './alunos-novo.csv'

// csv()
//   .fromFile(csvFilePath)
//   .then((jsonObj) => {
//     console.log("Dados lidos do CSV:", jsonObj);  // Adicione este log para verificar os dados
//     jsonObj.forEach(async (aluno) => {
//       try {
//         await addDoc(collection(firestore, "alunos"), {
//           name: aluno.name,        
//           matricula: "",
//           cpf: aluno.cpf
//         });
//         console.log("Aluno adicionado com sucesso:", aluno.name);
//       } catch (error) {
//         console.error("Erro ao adicionar aluno:", error);
//       }
//     });
//   })
//   .catch((error) => {
//     console.error("Erro ao converter CSV para JSON:", error);
//   });
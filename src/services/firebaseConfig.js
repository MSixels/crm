import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
//import csv from 'csvtojson';
//import { addDoc, collection } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDlVkgHwtKH6tkLYgvW4LMlGLOLTSLngU0",
  authDomain: "sistema-pccn-be44a.firebaseapp.com",
  projectId: "sistema-pccn-be44a",
  storageBucket: "sistema-pccn-be44a.appspot.com",
  messagingSenderId: "205766770180",
  appId: "1:205766770180:web:6f26559b53394b8338ff51"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
export const auth = getAuth(app)
export const firestore = getFirestore(app)
export const storage = getStorage(app)


/*
const csvFilePath = '../../alunos.csv'

csv()
  .fromFile(csvFilePath)
  .then((jsonObj) => {
    console.log("Dados lidos do CSV:", jsonObj);  // Adicione este log para verificar os dados
    jsonObj.forEach(async (aluno) => {
      try {
        await addDoc(collection(firestore, "alunos"), {
          name: aluno.name,        
          matricula: aluno.matricula   
        });
        console.log("Aluno adicionado com sucesso:", aluno.name);
      } catch (error) {
        console.error("Erro ao adicionar aluno:", error);
      }
    });
  })
  .catch((error) => {
    console.error("Erro ao converter CSV para JSON:", error);
  });
*/
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { firestore, storage } from "../services/firebaseConfig";
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

export const evaluateTDAHPotential = (responses) => {
    let tdahScores = { never: 0, sometimes: 0, always: 0 };

    responses.forEach(response => {
        const { quest, value } = response;

        if (quest >= 1 && quest <= 8) {
            if (value === 1) {
                tdahScores.never++;
            } else if (value === 2) {
                tdahScores.sometimes++;
            } else if (value === 3) {
                tdahScores.always++;
            }
        }
    });

    const sometimesAlwaysTotal = tdahScores.sometimes + tdahScores.always;
    let tdahPotential = 'pp';
    if (sometimesAlwaysTotal >= 6) {
        tdahPotential = 'mp';
    } else if (sometimesAlwaysTotal >= 4) {
        tdahPotential = 'p';
    }

    return { tdahPotential };
};

export const evaluateTEAPotential = (responses) => {
    let teaScores = { never: 0, sometimes: 0, always: 0 };

    responses.forEach(response => {
        const { quest, value } = response;

        if (quest >= 9 && quest <= 16) {
            if (value === 1) {
                teaScores.never++;
            } else if (value === 2) {
                teaScores.sometimes++;
            } else if (value === 3) {
                teaScores.always++;
            }
        }
    });

    const sometimesAlwaysTotal = teaScores.sometimes + teaScores.always;
    let teaPotential = 'pp'; 
    if (sometimesAlwaysTotal >= 6) {
        teaPotential = 'mp';
    } else if (sometimesAlwaysTotal >= 4) {
        teaPotential = 'p';
    }

    return { teaPotential };
};

export const evaluateTEAPPotential = (responses) => {
    let teapScores = { never: 0, sometimes: 0, always: 0 };

    responses.forEach(response => {
        const { quest, value } = response;

        if (quest >= 17 && quest <= 20) {
            if (value === 1) {
                teapScores.never++;
            } else if (value === 2) {
                teapScores.sometimes++;
            } else if (value === 3) {
                teapScores.always++;
            }
        }
    });

    const sometimesAlwaysTotal = teapScores.sometimes + teapScores.always;
    let teapPotential = 'pp'; 
    if (sometimesAlwaysTotal >= 3) {
        teapPotential = 'mp';
    } else if (sometimesAlwaysTotal == 2) {
        teapPotential = 'p';
    }

    return { teapPotential };
};

export const evaluateTLPotential = (responses) => {
    let tlScores = { never: 0, sometimes: 0, always: 0 };

    responses.forEach(response => {
        const { quest, value } = response;

        if (quest >= 21 && quest <= 24) {
            if (value === 1) {
                tlScores.never++;
            } else if (value === 2) {
                tlScores.sometimes++;
            } else if (value === 3) {
                tlScores.always++;
            }
        }
    });

    const sometimesAlwaysTotal = tlScores.sometimes + tlScores.always;
    let tlPotential = 'pp'; 
    if (sometimesAlwaysTotal >= 3) {
        tlPotential = 'mp';
    } else if (sometimesAlwaysTotal == 2) {
        tlPotential = 'p';
    }

    return { tlPotential };
};

export const evaluateTODPotential = (responses) => {
    let todScores = { never: 0, sometimes: 0, always: 0 };

    responses.forEach(response => {
        const { quest, value } = response;

        if (quest >= 25 && quest <= 28) {
            if (value === 1) {
                todScores.never++;
            } else if (value === 2) {
                todScores.sometimes++;
            } else if (value === 3) {
                todScores.always++;
            }
        }
    });

    const sometimesAlwaysTotal = todScores.sometimes + todScores.always;
    let todPotential = 'pp'; 
    if (sometimesAlwaysTotal >= 3) {
        todPotential = 'mp';
    } else if (sometimesAlwaysTotal == 2) {
        todPotential = 'p';
    }

    return { todPotential };
};

export const evaluateTDIPotential = (responses) => {
    let tdiScores = { never: 0, sometimes: 0, always: 0 };

    responses.forEach(response => {
        const { quest, value } = response;

        if (quest >= 29 && quest <= 32) {
            if (value === 1) {
                tdiScores.never++;
            } else if (value === 2) {
                tdiScores.sometimes++;
            } else if (value === 3) {
                tdiScores.always++;
            }
        }
    });

    const sometimesAlwaysTotal = tdiScores.sometimes + tdiScores.always;
    let tdiPotential = 'pp'; 
    if (sometimesAlwaysTotal >= 3) {
        tdiPotential = 'mp';
    } else if (sometimesAlwaysTotal == 2) {
        tdiPotential = 'p';
    }

    return { tdiPotential };
};

export const disableUserInFirestore = async (id) => {
    try {
        console.log('Tentando desativar usuário do Firestore com ID:', id);
        const userDoc = doc(firestore, 'users', id); 
        await updateDoc(userDoc, { disable: true }); 
        console.log('Usuário desativado do Firestore com sucesso');
    } catch (error) {
        console.error('Erro ao desativar o usuário do Firestore:', error.message);
        throw new Error('Erro ao desativar o usuário do Firestore');
    }
};
export const reactivateUserInFirestore = async (id) => {
    try {
        console.log('Tentando reativar usuário do Firestore com ID:', id);
        const userDoc = doc(firestore, 'users', id); 
        await updateDoc(userDoc, { disable: false }); 
        console.log('Usuário reativado do Firestore com sucesso');
    } catch (error) {
        console.error('Erro ao reativar o usuário do Firestore:', error.message);
        throw new Error('Erro ao reativar o usuário do Firestore');
    }
};

export const updateModulo = async (id, name, description, professorId, liberacao, validade) => {
    try {
        const moduloRef = doc(firestore, 'modulos', id);

        await updateDoc(moduloRef, {
            name,
            description,
            professorId,
            liberacao,
            validade
        });

        console.log("Módulo atualizado com sucesso!");
        return true;
    } catch (error) {
        console.error("Erro ao atualizar o módulo:", error);
        return false;
    }
};

export const deleteModulo = async (id) => {
    try {
        // Deletar o módulo
        const moduloRef = doc(firestore, 'modulos', id);
        await deleteDoc(moduloRef);
        console.log("Módulo deletado com sucesso!");

        // Excluir os conteúdos relacionados ao módulo
        const conteudoQuery = query(collection(firestore, 'conteudo'), where('moduloId', '==', id));
        const conteudoSnapshot = await getDocs(conteudoQuery);

        const conteudoIds = [];
        for (const conteudoDoc of conteudoSnapshot.docs) {
            conteudoIds.push(conteudoDoc.id);
            await deleteDoc(conteudoDoc.ref); 
        }
        console.log("Conteúdos deletados com sucesso!");

        // Excluir as aulas relacionadas aos conteúdos
        if (conteudoIds.length > 0) {
            const aulasQuery = query(collection(firestore, 'aulas'), where('conteudoId', 'in', conteudoIds));
            const aulasSnapshot = await getDocs(aulasQuery);
            for (const aulaDoc of aulasSnapshot.docs) {
                await deleteDoc(aulaDoc.ref);
            }
            console.log("Aulas deletadas com sucesso!");

            // Excluir as provas relacionadas aos conteúdos
            const provasQuery = query(collection(firestore, 'provas'), where('conteudoId', 'in', conteudoIds));
            const provasSnapshot = await getDocs(provasQuery);
            for (const provaDoc of provasSnapshot.docs) {
                await deleteDoc(provaDoc.ref);
            }
            console.log("Provas deletadas com sucesso!");
        }

        // Excluir os materiais relacionados ao módulo, caso existam
        const materiaisQuery = query(collection(firestore, 'materiais'), where('moduloId', '==', id));
        const materiaisSnapshot = await getDocs(materiaisQuery);

        if (!materiaisSnapshot.empty) {
            for (const materialDoc of materiaisSnapshot.docs) {
                // Obter o URL do material
                const fileUrl = materialDoc.data().materialUrl;
                if (fileUrl) {
                    // Excluir o material do Firestore
                    await deleteDoc(materialDoc.ref);
                    console.log(`Material ${materialDoc.id} deletado com sucesso!`);

                    // Excluir o arquivo relacionado no Storage
                    try {
                        // Ajuste para garantir que o caminho do arquivo no Firebase Storage seja correto
                        const path = fileUrl.split("/o/")[1].split("?")[0];
                        const storageRef = ref(storage, decodeURIComponent(path)); // Decodifica o caminho para garantir que seja correto
                        await deleteObject(storageRef);
                        console.log(`Arquivo ${fileUrl} deletado com sucesso do Storage!`);
                    } catch (storageError) {
                        console.error("Erro ao excluir o arquivo do Storage:", storageError);
                    }
                } else {
                    console.log(`Material ${materialDoc.id} não possui URL para exclusão no Storage.`);
                }
            }
        } else {
            console.log("Nenhum material encontrado para o módulo.");
        }

        return true;
    } catch (error) {
        console.error("Erro ao deletar o módulo e os conteúdos associados:", error);
        return false;
    }
};

export const deleteConteudo = async (id) => {
    try {
        if (!firestore) {
            throw new Error('Instância Firestore não encontrada');
        }

        const conteudoRef = doc(firestore, 'conteudo', id);
        await deleteDoc(conteudoRef);

        const aulasQuery = query(
            collection(firestore, 'aulas'),
            where('conteudoId', '==', id)
        );
        const aulasSnapshot = await getDocs(aulasQuery);
        aulasSnapshot.forEach(async (docSnapshot) => {
            const aulaRef = doc(firestore, 'aulas', docSnapshot.id);
            await deleteDoc(aulaRef);
            console.log(`Aula com id ${docSnapshot.id} deletada.`);
        });

        const provasQuery = query(
            collection(firestore, 'provas'),
            where('conteudoId', '==', id)
        );
        const provasSnapshot = await getDocs(provasQuery);
        provasSnapshot.forEach(async (docSnapshot) => {
            const provaRef = doc(firestore, 'provas', docSnapshot.id);
            await deleteDoc(provaRef);
            console.log(`Prova com id ${docSnapshot.id} deletada.`);
        });
    } catch (error) {
        console.error("Erro ao deletar conteúdo:", error);
    }
}

export const updateAula = async (id, name, description, videoUrl, type) => {
    try {
        const aulaRef = doc(firestore, 'aulas', id);

        const updatedData = {
            name,
            description,
            videoUrl,
            type
        };

        await updateDoc(aulaRef, updatedData);

        console.log('Aula atualizada com sucesso!');
        return true;
    } catch (error) {
        console.error('Erro ao atualizar a aula:', error);
        return false;
    }
};

export const updateGame = async (id, name, description, link, type) => {
    try {
        const aulaRef = doc(firestore, 'aulas', id);

        const updatedData = {
            name,
            description,
            link,
            type
        };

        await updateDoc(aulaRef, updatedData);

        console.log('Aula atualizada com sucesso!');
        return true;
    } catch (error) {
        console.error('Erro ao atualizar a aula:', error);
        return false;
    }
}

export const updateProva = async (id, name, description, quests, type) => {
    try {
        const aulaRef = doc(firestore, 'provas', id);

        const updatedData = {
            name,
            description,
            quests,
            type
        };

        await updateDoc(aulaRef, updatedData);

        console.log('Aula atualizada com sucesso!');
        return true;
    } catch (error) {
        console.error('Erro ao atualizar a aula:', error);
        return false;
    }
}

export const updateStoryTelling = async (id, name, description, pdf, type) => {
    try {
        const storyRef = doc(firestore, 'provas', id);

        const updatedData = { name, description, type };

        if (pdf) {
            const storageRef = ref(storage, `pdfs/${pdf.name}`);
            const uploadTask = uploadBytesResumable(storageRef, pdf);

            await new Promise((resolve, reject) => {
                uploadTask.on(
                    'state_changed',
                    null, 
                    (error) => reject(error),
                    async () => {
                        const pdfUrl = await getDownloadURL(uploadTask.snapshot.ref);
                        updatedData.pdfUrl = pdfUrl; 
                        resolve();
                    }
                );
            });
        }

        await updateDoc(storyRef, updatedData);

        console.log('StoryTelling atualizada com sucesso!');
        return true;
    } catch (error) {
        console.error('Erro ao atualizar StoryTelling:', error);
        return false;
    }
}

export const deleteAula = async (id) => {
    try {
        const aulaRef = doc(firestore, 'aulas', id);

        await deleteDoc(aulaRef);

        console.log('Aula deletada com sucesso!');
        return true;
    } catch (error) {
        console.error('Erro ao deletar a aula:', error);
        return false;
    }
}

export const deleteGame = async (id) => {
    try {
        const aulaRef = doc(firestore, 'aulas', id);

        await deleteDoc(aulaRef);

        console.log('Game deletado com sucesso!');
        return true;
    } catch (error) {
        console.error('Erro ao deletar a game:', error);
        return false;
    }
}

export const deleteProva = async (id) => {
    try {
        const provaRef = doc(firestore, 'provas', id);

        await deleteDoc(provaRef);

        console.log('Prova deletada com sucesso!');
        return true;
    } catch (error) {
        console.error('Erro ao deletar a prova:', error);
        return false;
    }
}

export const deleteStoryTelling = async (id) => {
    try {
        const provaRef = doc(firestore, 'provas', id);
        const provaSnap = await getDoc(provaRef);

        if (provaSnap.exists()) {
            const pdfUrl = provaSnap.data().pdfUrl;

            if (pdfUrl) {
                const storageRef = ref(storage, pdfUrl);
                
                try {
                    await deleteObject(storageRef);
                    console.log('PDF deletado com sucesso do Storage!');
                } catch (error) {
                    console.warn('PDF não encontrado ou erro ao deletar do Storage:', error);
                }
            }
        }

        await deleteDoc(provaRef);
        console.log('StoryTelling deletado com sucesso do Firestore!');

        return true;
    } catch (error) {
        console.error('Erro ao deletar a StoryTelling:', error);
        return false;
    }
};

export const fetchModulos = async (setModulos) => {
    try {
        const modulosCollectionRef = collection(firestore, "modulos");

        const modulosSnapshot = await getDocs(modulosCollectionRef);

        const modulosList = modulosSnapshot.docs.map(doc => ({
            id: doc.id,  
            ...doc.data() 
        }));

        setModulos(modulosList)
    } catch (error) {
        console.error("Erro ao buscar módulos: ", error);
        setModulos([])
    }
}

export const fetchConteudos = async (setConteudos) => {
    try {
        const conteudosCollectionRef = collection(firestore, "conteudo");

        const conteudosSnapshot = await getDocs(conteudosCollectionRef);

        const conteudosList = conteudosSnapshot.docs.map(doc => ({
            id: doc.id,  
            ...doc.data() 
        }));

        setConteudos(conteudosList)
    } catch (error) {
        console.error("Erro ao buscar conteudos: ", error);
        setConteudos([])
    }
}

export const fetchProvasCriadas = async (setProvasCriadas) => {
    try {
        const provasCollectionRef = collection(firestore, "provas");

        const q = query(provasCollectionRef, where("type", "==", "prova"));

        const provasSnapshot = await getDocs(q);

        const provasList = provasSnapshot.docs.map(doc => ({
            id: doc.id,  
            ...doc.data() 
        }));

        setProvasCriadas(provasList);
    } catch (error) {
        console.error("Erro ao buscar provas: ", error);
        setProvasCriadas([]);  
    }
};

export const fetchRastreios = async (setRastreios, setLoadingRastreios) => {
    try {
        const rastreiosCollectionRef = collection(firestore, "rastreios");

        // Criando a consulta para pegar apenas os campos específicos
        const rastreiosQuery = query(rastreiosCollectionRef);

        const rastreiosSnapshot = await getDocs(rastreiosQuery);

        const rastreiosList = rastreiosSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                createdAt: data.createdAt,
                userId: data.userId
            };
        });

        setRastreios(rastreiosList);
        setLoadingRastreios(false)
    } catch (error) {
        console.error("Erro ao buscar rastreios: ", error);
        setRastreios([]);
        setLoadingRastreios(false)
    }
};

export const fetchAccess = async (setAccess, setLoadingAccess) => {
    try {
        const accessCollectionRef = collection(firestore, "access");

        const accessQuery = query(accessCollectionRef);

        const accessSnapshot = await getDocs(accessQuery);

        const accessList = accessSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                createdAt: data.createdAt,
                userId: data.userId
            };
        });

        setAccess(accessList);
        setLoadingAccess(false)
    } catch (error) {
        console.error("Erro ao buscar acessos: ", error);
        setAccess([]);
        setLoadingAccess(false)
    }
};


export async function deleteUserFromFireBaseAuth(uid, update) {
    try {
      const response = await fetch(`http://localhost:3000/delete-user/${uid}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`Erro ao deletar usuário: ${response.statusText}`);
      }
  
      const data = await response.text(); 
      console.log(data);
      update();
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
    }
}

export async function generateCertificado(userId, name, cpf, update){
    try {
        const certificadosCollectionRef = collection(firestore, "certificados");

        const certificadoData = {
            userId: userId,
            name: name,
            cpf: cpf,
            createdAt: new Date() 
        };

        const docRef = await addDoc(certificadosCollectionRef, certificadoData);

        console.log("Certificado gerado com sucesso", docRef.id);
        update();
        
    } catch (error) {
        console.error("Erro ao gerar certificado:", error);
    }
}

export async function fetchCertificado(userId, setCertificado) {
    try {
        const certificadosCollectionRef = collection(firestore, "certificados");

        const q = query(certificadosCollectionRef, where("userId", "==", userId));

        const querySnapshot = await getDocs(q);

        const certificados = querySnapshot.docs.map(doc => ({
            id: doc.id, 
            ...doc.data() 
        }));

        setCertificado(certificados.length > 0 ? certificados[0] : null);
    } catch (error) {
        console.error("Erro ao buscar certificado:", error);
    }
}

export async function updateUserCertificado(userId, name, matricula, cpf) {
    try {
        const userDocRef = doc(firestore, "users", userId);

        await updateDoc(userDocRef, {
            name: name,
            matricula: matricula,
            cpf: cpf,
        });

    } catch (error) {
        console.error("Erro ao atualizar os dados do usuário:", error);
    }
}

export function isValidCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
  
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
      return false; 
    }
  
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += Number(cpf[i]) * (10 - i);
    }
    let firstDigit = (sum * 10) % 11;
    if (firstDigit === 10) firstDigit = 0;
    if (firstDigit !== Number(cpf[9])) return false;
  
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += Number(cpf[i]) * (11 - i);
    }
    let secondDigit = (sum * 10) % 11;
    if (secondDigit === 10) secondDigit = 0;
  
    return secondDigit === Number(cpf[10]);
  }
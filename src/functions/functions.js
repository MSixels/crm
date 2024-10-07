import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { auth, firestore } from "../services/firebaseConfig";

export const evaluateTDAHPotential = (responses) => {
    let tdahScores = { never: 0, sometimes: 0, always: 0 };

    responses.forEach(response => {
        //console.log('TDAH Responses', response)
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

    const tdahTotal = tdahScores.never + tdahScores.sometimes + tdahScores.always;
    let tdahPotential = 'pp'; 
    if (tdahTotal > 0) {
        const alwaysPercentage = (tdahScores.always / tdahTotal) * 100;
        if (alwaysPercentage > 50) {
            tdahPotential = 'mp'; 
        } else if (alwaysPercentage > 20) {
            tdahPotential = 'p'; 
        }
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

    const teaTotal = teaScores.never + teaScores.sometimes + teaScores.always;
    let teaPotential = 'pp'; 
    if (teaTotal > 0) {
        const alwaysPercentage = (teaScores.always / teaTotal) * 100;
        if (alwaysPercentage > 50) {
            teaPotential = 'mp'; 
        } else if (alwaysPercentage > 20) {
            teaPotential = 'p'; 
        }
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

    const teapTotal = teapScores.never + teapScores.sometimes + teapScores.always;
    let teapPotential = 'pp'; 
    if (teapTotal > 0) {
        const alwaysPercentage = (teapScores.always / teapTotal) * 100;
        if (alwaysPercentage > 50) {
            teapPotential = 'mp'; 
        } else if (alwaysPercentage > 20) {
            teapPotential = 'p'; 
        }
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

    const tlTotal = tlScores.never + tlScores.sometimes + tlScores.always;
    let tlPotential = 'pp'; 
    if (tlTotal > 0) {
        const alwaysPercentage = (tlScores.always / tlTotal) * 100;
        if (alwaysPercentage > 50) {
            tlPotential = 'mp'; 
        } else if (alwaysPercentage > 20) {
            tlPotential = 'p'; 
        }
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

    const todTotal = todScores.never + todScores.sometimes + todScores.always;
    let todPotential = 'pp'; 
    if (todTotal > 0) {
        const alwaysPercentage = (todScores.always / todTotal) * 100;
        if (alwaysPercentage > 50) {
            todPotential = 'mp'; 
        } else if (alwaysPercentage > 20) {
            todPotential = 'p'; 
        }
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

    const tdiTotal = tdiScores.never + tdiScores.sometimes + tdiScores.always;
    let tdiPotential = 'pp'; 
    if (tdiTotal > 0) {
        const alwaysPercentage = (tdiScores.always / tdiTotal) * 100;
        if (alwaysPercentage > 50) {
            tdiPotential = 'mp'; 
        } else if (alwaysPercentage > 20) {
            tdiPotential = 'p'; 
        }
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
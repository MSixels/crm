import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { auth, firestore } from "../services/firebaseConfig";

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
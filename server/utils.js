import { RIGHE, COLONNE } from './constants.js';

export const controllaVittoria = function (matrice, giocatore) {
  // Controllo vittoria orizzontale
  for (let riga = 0; riga < RIGHE; riga++) {
    for (let colonna = 0; colonna < COLONNE - 3; colonna++) {
      if (
        matrice[riga][colonna] === giocatore &&
        matrice[riga][colonna + 1] === giocatore &&
        matrice[riga][colonna + 2] === giocatore &&
        matrice[riga][colonna + 3] === giocatore
      ) {
        return true; // Vittoria orizzontale
      }
    }
  }

  // Controllo vittoria verticale
  for (let riga = 0; riga < RIGHE - 3; riga++) {
    for (let colonna = 0; colonna < COLONNE; colonna++) {
      if (
        matrice[riga][colonna] === giocatore &&
        matrice[riga + 1][colonna] === giocatore &&
        matrice[riga + 2][colonna] === giocatore &&
        matrice[riga + 3][colonna] === giocatore
      ) {
        return true; // Vittoria verticale
      }
    }
  }

  // Controllo vittoria diagonale (da sinistra in basso a destra in alto)
  for (let riga = 0; riga < RIGHE - 3; riga++) {
    for (let colonna = 0; colonna < COLONNE - 3; colonna++) {
      if (
        matrice[riga][colonna] === giocatore &&
        matrice[riga + 1][colonna + 1] === giocatore &&
        matrice[riga + 2][colonna + 2] === giocatore &&
        matrice[riga + 3][colonna + 3] === giocatore
      ) {
        return true; // Vittoria diagonale
      }
    }
  }

  // Controllo vittoria diagonale (da sinistra in alto a destra in basso)
  for (let riga = 3; riga < RIGHE; riga++) {
    for (let colonna = 0; colonna < COLONNE - 3; colonna++) {
      if (
        matrice[riga][colonna] === giocatore &&
        matrice[riga - 1][colonna + 1] === giocatore &&
        matrice[riga - 2][colonna + 2] === giocatore &&
        matrice[riga - 3][colonna + 3] === giocatore
      ) {
        return true; // Vittoria diagonale
      }
    }
  }

  return false; // Nessuna vittoria
};

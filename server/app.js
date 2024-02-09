import { RIGHE, COLONNE } from './constants.js';
import { controllaVittoria } from './utils.js';

const matrice = Array.from({ length: RIGHE }, () => Array(COLONNE).fill(null));

const giocatori = ['rosso', 'giallo'];
let giocatoreTurno = giocatori[0];

export const handleConnection = function (socket, io, CONNESSIONI) {
	const coloreGiocatore = giocatori.shift();
	socket.emit('info-giocatore', socket.id, coloreGiocatore);

	if (CONNESSIONI === 2) {
		console.log('inizio partita');
		io.emit('inizio-partita', matrice, giocatoreTurno);
	}

	socket.on('mossa', (giocatore, colonna) => {
		// controllo se è il turno del giocatore
		if (giocatore !== giocatoreTurno) return;

		// aggiorna la matrice con la mossa del giocatore
		let cambiato = false;
		for (let i = RIGHE - 1; i >= 0; i--) {
			if (!matrice[i][colonna]) {
				matrice[i][colonna] = giocatore;
				cambiato = true;
				break;
			}
		}
		if (!cambiato) return;

		io.emit('aggiorna-matrice', matrice);

		// aggiorna il turno del giocatore
		giocatoreTurno = giocatoreTurno === 'rosso' ? 'giallo' : 'rosso';
		io.emit('aggiorna-turno', giocatoreTurno);

		if (controllaVittoria(matrice, giocatore)) {
			io.emit('vittoria', giocatore);
			io.emit('nuova-partita');
		}
		if (matrice.every((riga) => riga.every((cella) => !!cella))) {
			io.emit('pareggio');
			io.emit('nuova-partita');
		}
	});

	socket.on('disconnect', () => {
		// quando un giocatore si disconnette, rimette il suo colore nella lista dei giocatori
		if (coloreGiocatore === 'rosso') giocatori.unshift(coloreGiocatore);
		else giocatori.push(coloreGiocatore);
	});
};

// todo: di default apre il caricamento, quando partita inizia disegnare matrice

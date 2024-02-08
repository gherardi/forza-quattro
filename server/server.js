import { Server } from 'socket.io';

console.clear();

const io = new Server(3000, {
	cors: {
		origin: ['http://localhost:5173'],
	},
});

let CONNESSIONI = 0;

// VARIABILI
const RIGHE = 6;
const COLONNE = 7;

const matrice = Array.from({ length: RIGHE }, () => Array(COLONNE).fill(null));

const giocatori = ['rosso', 'giallo'];
let giocatoreMossaCorrente = giocatori[0];

io.on('connection', (socket) => {
	CONNESSIONI++;
	if (CONNESSIONI > 2) {
		// CONNESSIONI--;
		socket.emit('limite-connessioni');
		socket.disconnect();
		CONNESSIONI--;
		return;
	}
	console.log('client connesso:' + socket.id);
	const coloreGiocatore = giocatori.shift();

	socket.on('disconnect', () => {
		console.log('client disconnesso:' + socket.id);
		if (coloreGiocatore === 'rosso') giocatori.unshift(coloreGiocatore);
		else giocatori.push(coloreGiocatore);
		CONNESSIONI--;
	});

	socket.emit('info-giocatore', socket.id, coloreGiocatore, matrice);

	socket.emit('aggiorna-matrice', matrice);

	io.emit('aggiorna-turno', giocatoreMossaCorrente);

	socket.on('mossa', (colore, colonna) => {
		// check se è il turno del giocatore
		if (colore !== giocatoreMossaCorrente) return;
		// cambia il giocatore corrente
		giocatoreMossaCorrente = giocatoreMossaCorrente === 'rosso' ? 'giallo' : 'rosso';

		io.emit('aggiorna-turno', giocatoreMossaCorrente);

		for (let i = 6 - 1; i >= 0; i--) {
			if (!matrice[i][colonna]) {
				matrice[i][colonna] = colore;
				break;
			}
		}

		io.emit('aggiorna-matrice', matrice);

		if (controllaVittoria(matrice, colore)) {
			io.emit('vittoria', colore);
			io.emit("nuova-partita");
		} else if (matrice.every((riga) => riga.every((cella) => !!cella))) {
			io.emit('pareggio');
			io.emit("nuova-partita");
		}
	});


	socket.on('nuova-partita', () => {
		matrice.forEach((riga, i) => {
			matrice[i] = Array(COLONNE).fill(null);
		});
		io.emit('aggiorna-matrice', matrice);
		io.emit('aggiorna-turno', giocatoreMossaCorrente);
	});
});

function controllaVittoria(matrice, giocatore) {
	// Controllo vittoria orizzontale
	for (let riga = 0; riga < 6; riga++) {
		for (let colonna = 0; colonna < 4; colonna++) {
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
	for (let riga = 0; riga < 3; riga++) {
		for (let colonna = 0; colonna < 7; colonna++) {
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
	for (let riga = 0; riga < 3; riga++) {
		for (let colonna = 0; colonna < 4; colonna++) {
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
	for (let riga = 3; riga < 6; riga++) {
		for (let colonna = 0; colonna < 4; colonna++) {
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
}

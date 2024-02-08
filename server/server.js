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
	console.log("client connesso:" + socket.id);
	const coloreGiocatore = giocatori.shift();

	socket.on('disconnect', () => {
		console.log("client disconnesso:" + socket.id);
		if (coloreGiocatore === 'rosso') giocatori.unshift(coloreGiocatore);
		else giocatori.push(coloreGiocatore);
		CONNESSIONI--;
	});

	socket.emit('info-giocatore', socket.id, coloreGiocatore, matrice);

	socket.emit("aggiorna-matrice", matrice);

	socket.on('mossa', (colore, colonna) => {
		// check se è il turno del giocatore
		if (colore !== giocatoreMossaCorrente) return;

		// cambia il giocatore corrente
		giocatoreMossaCorrente = giocatoreMossaCorrente === 'rosso' ? 'giallo' : 'rosso';

		for (let i = 6 - 1; i >= 0; i--) {
			if (!matrice[i][colonna]) {
				// Colora la cella e aggiorna lo stato
				matrice[i][colonna] = colore;

				// todo: Verifica la vittoria dopo ogni mossa (usando la funzione controllaVittoria)
				// if (controllaVittoria(statoCelle, giocatoreCorrente)) {
				// alert(`Il giocatore ${giocatoreCorrente.toUpperCase()} ha vinto!`);
				// Puoi implementare altre azioni dopo la vittoria, come ricominciare il gioco, ecc.
				// }
				break;
			}
		}

		io.emit("aggiorna-matrice", matrice);
	});
});

// ad ogni mossa, controlla se c'è un vincitore, controllare se è piena la matrice, controllare se un giocatore si è disconnesso

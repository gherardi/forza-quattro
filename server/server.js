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

io.on('connection', (socket) => {
	CONNESSIONI++;
	if (CONNESSIONI > 2) {
		// CONNESSIONI--;
		socket.emit('limite-connessioni');
		socket.disconnect();
		CONNESSIONI--;
		return;
	}
	const coloreGiocatore = giocatori.shift();

	socket.on('disconnect', () => {
		if (coloreGiocatore === 'rosso') giocatori.unshift(coloreGiocatore);
		else giocatori.push(coloreGiocatore);
		CONNESSIONI--;
	});

	socket.emit('info-giocatore', socket.id, coloreGiocatore, matrice);
});

// ad ogni mossa, controlla se c'è un vincitore, controllare se è piena la matrice, controllare se un giocatore si è disconnesso

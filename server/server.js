import crypto from 'crypto';
import { Server } from 'socket.io';

import { controllaVittoria } from './utils.js';

const io = new Server(3000, {
	cors: {
		origin: ['http://localhost:5173'],
	},
});

const RIGHE = 6;
const COLONNE = 7;

const partite = [
	// {
	// 	room: crypto.randomUUID(),
	// 	giocatori: [{id: socket.id, colore: "rosso"}, {id: socket.id, colore: "giallo"}],
	// 	turno: giocatori[0],
	// 	matrice: Array.from({ length: RIGHE }, () => Array(COLONNE).fill(null)),
	// },
];

io.on('connection', (socket) => {
	if (partite.length === 0 || partite[partite.length - 1].giocatori.length === 2) {
		const room = crypto.randomUUID();
		socket.join(room);
		partite.push({
			room,
			giocatori: [{ id: socket.id, colore: 'rosso' }],
			matrice: Array.from({ length: RIGHE }, () => Array(COLONNE).fill(null)),
			turno: 0,
		});
	} else {
		const partita = partite[partite.length - 1];
		partita.giocatori.push({ id: socket.id, colore: 'giallo' });
		socket.join(partita.room);

		io.to(partita.giocatori[0].id).emit('info', 0, partita);
		io.to(partita.giocatori[1].id).emit('info', 1, partita);

		io.to(partita.room).emit('inizio-partita', partita);
	}

	socket.on('mossa', (room, giocatore, colonna) => {
		// controllo se è il turno del giocatore
		const partita = partite.find((p) => p.room === room);
		if (partita.turno !== giocatore) return;

		// aggiorna la matrice con la mossa del giocatore
		let cambiato = false;
		for (let i = RIGHE - 1; i >= 0; i--) {
			if (partita.matrice[i][colonna] === null) {
				partita.matrice[i][colonna] = giocatore;
				cambiato = true;
				break;
			}
		}
		if (!cambiato) return;

		io.to(room).emit('aggiorna-matrice', partita.matrice);

		// aggiorna il turno del giocatore
		partita.turno = partita.turno === 0 ? 1 : 0;

		io.to(room).emit('aggiorna-turno', partita.turno);

		const fine = controllaVittoria(partita.matrice, giocatore);

		if (fine) {
			io.to(room).emit('fine-partita', giocatore);
			return;
		}

		const pareggio = partita.matrice.every((riga) =>
			riga.every((cella) => cella === 0 || cella === 1)
		);
		if (pareggio) {
			io.to(room).emit('fine-partita', 'pareggio');
		}
	});
});

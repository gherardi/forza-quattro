import { Server } from 'socket.io';

const io = new Server(3000, {
	cors: {
		origin: ['http://localhost:5173'],
	},
});

let playerNumber = 0;

io.on('connection', (socket) => {
  // check numero massimo di connessioni
	if (playerNumber > 1) {
		io.emit('exeed-players');
		socket.disconnect();
		return;
	}

	// console.log('Client connesso: ' + socket.id);

	socket.on('send-message', (msg) => {
		socket.broadcast.emit('receive-message', msg);
	});

	socket.on('disconnect', () => {
		playerNumber--;
		// console.log('Client disconnesso: ' + socket.id);
	});

	io.emit('player-info', playerNumber, socket.id);

	playerNumber++;
});

// function creaMatriceVuota() {
// 	return Array.from({ length: RIGHE }, () => Array(COLONNE).fill(null));
// }

console.clear();

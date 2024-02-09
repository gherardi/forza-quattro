import { Server } from 'socket.io';

import { PORT } from './constants.js';
import { handleConnection } from './app.js';

const io = new Server(PORT, {
	cors: {
		origin: ['http://localhost:5173'],
	},
});

let CONNESSIONI = 0;

io.on('connection', (socket) => {
	CONNESSIONI++;

	// Limita il numero di connessioni
	if (CONNESSIONI > 2) {
		socket.emit('limite-connessioni');
		socket.disconnect();
		CONNESSIONI--;
		return;
	}

	console.log('NUMERO CONNESSIONI:', CONNESSIONI);

	handleConnection(socket, io, CONNESSIONI);

	socket.on('disconnect', () => {
		CONNESSIONI--;
	});
});

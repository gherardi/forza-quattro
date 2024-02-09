import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

let coloreGiocatore = null;
let socketId = null;
let BLOCCO = false;

socket.on('limite-connessioni', () => {
	document.querySelector('[data-loader]').classList.add('hidden');
	document.querySelector('[data-app]').classList.add('hidden');
	document.querySelector('[data-limite-connessioni]').classList.remove('hidden');
	document.querySelector('[data-limite-connessioni]').classList.add('flex');
});

socket.on('info-giocatore', (id, colore) => {
	socketId = id;
	coloreGiocatore = colore;
});

socket.on('inizio-partita', (matrice, turno) => {
	document.querySelector('[data-loader]').classList.add('hidden');
	document.querySelector('[data-app]').classList.remove('hidden');
	document.querySelector('[data-app]').classList.add('flex');

	disegnaInfo();
	aggiornaTurno(turno);

	disegnaGriglia(matrice);
	gestisciClick();
});

socket.on('aggiorna-turno', (colore) => {
	const turno = document.querySelector('[data-turno]');
	if (colore === coloreGiocatore) {
		turno.textContent = '🟩 È il tuo turno!';
	} else {
		turno.textContent = '🟥 È il tuo del tuo avversario!';
	}
});

socket.on('aggiorna-matrice', (matrice) => {
	disegnaGriglia(matrice);
});

socket.on('vittoria', (colore) => {
	BLOCCO = true;
	const turno = document.querySelector('[data-turno]');
	turno.textContent = colore === coloreGiocatore ? '🟩 Hai vinto!' : '🟥 Hai perso!';
});

socket.on('pareggio', () => {
	BLOCCO = true;
	const turno = document.querySelector('[data-turno]');
	turno.textContent = 'Pareggio!';
});

const disegnaGriglia = function (matrice) {
	const griglia = document.querySelector('[data-griglia]');
	griglia.innerHTML = '';

	matrice.forEach((riga, i) => {
		riga.forEach((cella, j) => {
			const html = `
				<div
					class="aspect-square rounded-full
					${cella === 'rosso' ? 'bg-red-600' : cella === 'giallo' ? 'bg-yellow-400' : 'bg-white'}
					"
					data-riga="${i}"
					data-colonna="${j}"
					data-cella
				</div>
			`;
			griglia.insertAdjacentHTML('beforeend', html);
		});
	});
};

const aggiornaTurno = function (colore) {
	const turno = document.querySelector('[data-turno]');
	if (colore === coloreGiocatore) {
		turno.textContent = '🟩 È il tuo turno!';
	} else {
		turno.textContent = '🟥 È il tuo del tuo avversario!';
	}
};

const disegnaInfo = function () {
	document.querySelector('[data-info]')?.remove();

	const classe = coloreGiocatore === 'rosso' ? 'border-l-red-600' : 'border-l-yellow-400';
	const html = `
		<div data-info class="absolute top-2 left-2 bg-black/50 font-medium ${classe} border-l-4 py-4 px-6 rounded-lg">
			Sei il giocatore ${coloreGiocatore}
		</div>
	`;
	document.body.insertAdjacentHTML('beforeend', html);
};

const gestisciClick = function () {
	const drops = document.querySelectorAll('[data-drop]');
	drops?.forEach((drop, index) => {
		drop.addEventListener('click', function () {
			if (BLOCCO) return;
			socket.emit('mossa', coloreGiocatore, index);
		});
	});
};

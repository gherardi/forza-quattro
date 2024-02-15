import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

const griglia = document.querySelector('[data-griglia]');
const dropContainer = document.querySelector('[data-drop-container]');
const turnoEl = document.querySelector('[data-turno]');
const fineSchermata = document.querySelector('[data-fine-schermata]');

let coloreGiocatore = null;
let socketId = null;
let FINE = false;

const colori = ['rosso', 'giallo'];
let colore = null;
let numero = null;
let room = null;

// const disegnaInfo = function () {
// 	document.querySelector('[data-info]')?.remove();

// 	const classe = coloreGiocatore === 'rosso' ? 'border-l-red-600' : 'border-l-yellow-400';
// 	const html = `
// 		<div data-info class="absolute top-2 left-2 bg-black/50 font-medium ${classe} border-l-4 py-4 px-6 rounded-lg">
// 			Sei il giocatore ${coloreGiocatore}
// 		</div>
// 	`;
// 	document.body.insertAdjacentHTML('beforeend', html);
// };

const impostaInfo = function (num, partita) {
	colore = colori[num];
	numero = num;
	room = partita.room;
};

const iniziaPartita = function ({ matrice, turno: turnoCorrente }) {
	document.querySelector('[data-loader]').classList.add('hidden');
	document.querySelector('[data-app]').classList.remove('hidden');
	document.querySelector('[data-app]').classList.add('flex');
	document.querySelector('[data-turno]').classList.remove('hidden');

	// GRIGLIA
	disegnaGriglia(matrice);
	disegnaDrop();

	// INFO
	aggiornaTurno(turnoCorrente);
};

const aggiornaTurno = function (turnoCorrente) {
	if (turnoCorrente === numero) {
		turnoEl.textContent = '🟩 È il tuo turno!';
	} else {
		turnoEl.textContent = '🟥 È il tuo del tuo avversario!';
	}
};

const disegnaGriglia = function (matrice) {
	griglia.innerHTML = '';

	matrice.forEach((riga, i) => {
		riga.forEach((cella, j) => {
			const html = `
				<div
					class="aspect-square rounded-full
					${cella === 0 ? 'bg-red-600' : cella === 1 ? 'bg-yellow-400' : 'bg-white'}
					"
					data-riga="${i}"
					data-colonna="${j}"
					data-cella
				</div>
			`;
			griglia.insertAdjacentHTML('beforeend', html);
		});
	});
	griglia.classList.add('border-b-8', numero === 0 ? 'border-red-600' : 'border-yellow-400');
};

const disegnaDrop = function () {
	dropContainer.innerHTML = '';

	for (let i = 0; i < 7; i++) {
		const html = `
			<div
				class="hover:bg-white/25"
				data-drop="${i}"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-6 h-6 pointer-events-none"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
				</svg>
			</div>
		`;
		dropContainer.insertAdjacentHTML('beforeend', html);
	}

	dropContainer.addEventListener('click', function (e) {
		if (!e.target.dataset.drop) return;
		// numero giocatore, colonna della mossa
		socket.emit('mossa', room, numero, e.target.dataset.drop);
	});
};

const finePartita = function (vincitore) {
	FINE = true;

	document.querySelector('[data-app]').classList.add('hidden');
	turnoEl.classList.add('hidden');
	fineSchermata.classList.remove('hidden');

	if (vincitore === 'pareggio') {
		console.log('Pareggio!'); // chiamare un'altra funzione
		return;
	}
	fineSchermata.querySelector('[data-esito').textContent =
		vincitore === numero //
			? '🏆 Complimenti, hai vinto!'
			: '❌ Purtroppo hai perso...';
};

socket.on('info', impostaInfo);
socket.on('inizio-partita', iniziaPartita);
socket.on('aggiorna-matrice', disegnaGriglia);
socket.on('aggiorna-turno', aggiornaTurno);
socket.on('fine-partita', finePartita);

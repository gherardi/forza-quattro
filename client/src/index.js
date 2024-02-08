import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

let coloreGiocatore = null;
let BLOCCO = false;

socket.on('limite-connessioni', () => {
	document.body.innerHTML = '';
	document.body.innerHTML = `
	<div class="bg-black/50 font-medium flex items-center gap-2 border-b-red-600 border-b-2 py-4 px-6 rounded-lg text-lg">
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" class="w-8 h-8">
			<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
		</svg>
		Limite giocatori raggiunto
	</div>
	`;
});

socket.on('info-giocatore', (socketId, colore, matrice) => {
	coloreGiocatore = colore;
	disegnaInfo();
	addEventListeners();
});

const disegnaInfo = function () {
	const classe = coloreGiocatore === 'rosso' ? 'border-l-red-600' : 'border-l-yellow-400';
	const html = `
		<div class="absolute top-2 left-2 bg-black/50 font-medium ${classe} border-l-4 py-4 px-6 rounded-lg">
			Sei il giocatore ${coloreGiocatore}
		</div>
	`;
	document.body.insertAdjacentHTML('beforeend', html);
};

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

const addEventListeners = function () {
	const drops = document.querySelectorAll('[data-drop]');
	drops?.forEach((drop, index) => {
		drop.addEventListener('click', function () {
			if (BLOCCO) return;
			socket.emit('mossa', coloreGiocatore, index);
		});
	});
};

socket.on('aggiorna-matrice', (matrice) => {
	disegnaGriglia(matrice);
});

socket.on('aggiorna-turno', (colore) => {
	const turno = document.querySelector('[data-turno]');
	if (colore === coloreGiocatore) {
		turno.textContent = '🟩 È il tuo turno!';
	} else {
		turno.textContent = '🟥 È il tuo del tuo avversario!';
	}
});

socket.on('vittoria', (colore) => {
	BLOCCO = true;
	if (colore === coloreGiocatore) {
		alert('Hai vinto!');
	} else {
		alert('Hai perso!');
	}
});

socket.on('pareggio', () => {
	BLOCCO = true;
	alert('Pareggio!');
});

socket.on('nuova-partita', () => {
	setTimeout(() => {
		const res = prompt('vuoi giocare ancora?');
		if (res.toLowerCase() === 'si' || res.toLowerCase() === 'yes') {
			socket.emit('nuova-partita');
			BLOCCO = false;
		}
	}, 5000);
});

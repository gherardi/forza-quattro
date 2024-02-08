import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

let coloreGiocatore = null;

socket.on('limite-connessioni', () => {
	console.log('limite raggiunto');
	document.body.innerHTML = '';
	document.body.innerHTML = `
	<div class="bg-black/50 font-medium border-b-red-600 border-b-2 py-4 px-6 rounded-lg">
		Limite giocatori raggiunto
	</div>
	`;
});

socket.on('info-giocatore', (socketId, colore, matrice) => {
	coloreGiocatore = colore;
	disegnaInfo();
	disegnaGriglia(matrice);
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

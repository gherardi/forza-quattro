import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

let giocatore;

socket.on('limite-connessioni', () => {
	console.log('Limite di connessioni raggiunto. Impossibile connettersi.');
});

socket.on('info-giocatore', (socketId, colore, matrice) => {
	console.log('GIOCATORE:', colore);
	console.table(matrice);
	disegnaGriglia(matrice);
});

const disegnaGriglia = function (matrice) {
	const griglia = document.querySelector('[data-griglia]');
	griglia.innerHTML = '';
	matrice.forEach((riga, i) => {
		riga.forEach((cella, j) => {
			const html = `
				<div
					class="aspect-square rounded-full
					${
						cella === 'rosso'
						? 'bg-red-600'
						: cella === 'giallo'
						? 'bg-yellow-400'
						: 'bg-white'
					}
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

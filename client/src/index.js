const griglia = document.querySelector(".griglia");
const bottoneContainer = document.querySelector(".bottone-container");

const colonne = 7;
const righe = 6;
let giocatoreCorrente = "rosso"; // Puoi usare 'giallo' per il secondo giocatore

// Inizializza la matrice per tenere traccia dello stato delle celle
const statoCelle = Array.from({ length: righe }, () =>
  Array(colonne).fill(null)
);

// Crea la griglia del gioco
creaGriglia();

// Crea i bottoni per far cadere le palline
for (let j = 0; j < colonne; j++) {
  const bottone = document.createElement("button");
  bottone.classList.add("bottone");
  bottone.innerHTML = "&darr;";
  bottone.addEventListener("click", function () {
    dropPallina(j);
  });
  bottoneContainer.appendChild(bottone);
}

// Funzione per far cadere la pallina nella colonna selezionata
function dropPallina(colonna) {
  // Trova la prima cella vuota nella colonna
  for (let i = righe - 1; i >= 0; i--) {
    if (!statoCelle[i][colonna]) {
      // Colora la cella e aggiorna lo stato
      statoCelle[i][colonna] = giocatoreCorrente;
      const cella = griglia.querySelector(
        `.cella[data-colonna="${colonna}"][data-riga="${i}"]`
      );
      cella.classList.add(giocatoreCorrente);
      cella.style.backgroundColor = giocatoreCorrente;

      // Verifica la vittoria dopo ogni mossa (usando la funzione controllaVittoria)
      if (controllaVittoria(statoCelle, giocatoreCorrente)) {
        alert(`Il giocatore ${giocatoreCorrente.toUpperCase()} ha vinto!`);
        // Puoi implementare altre azioni dopo la vittoria, come ricominciare il gioco, ecc.
      }

      // Cambia il giocatore corrente
      giocatoreCorrente = giocatoreCorrente === "rosso" ? "giallo" : "rosso";
      break;
    }
  }
  console.log(statoCelle);
}

// Funzione per controllare la vittoria
// Funzione per controllare la vittoria
function controllaVittoria(matrice, giocatore) {
  // Controllo vittoria orizzontale
  for (let riga = 0; riga < 6; riga++) {
    for (let colonna = 0; colonna < 4; colonna++) {
      if (
        matrice[riga][colonna] === giocatore &&
        matrice[riga][colonna + 1] === giocatore &&
        matrice[riga][colonna + 2] === giocatore &&
        matrice[riga][colonna + 3] === giocatore
      ) {
        return true; // Vittoria orizzontale
      }
    }
  }

  // Controllo vittoria verticale
  for (let riga = 0; riga < 3; riga++) {
    for (let colonna = 0; colonna < 7; colonna++) {
      if (
        matrice[riga][colonna] === giocatore &&
        matrice[riga + 1][colonna] === giocatore &&
        matrice[riga + 2][colonna] === giocatore &&
        matrice[riga + 3][colonna] === giocatore
      ) {
        return true; // Vittoria verticale
      }
    }
  }

  // Controllo vittoria diagonale (da sinistra in basso a destra in alto)
  for (let riga = 0; riga < 3; riga++) {
    for (let colonna = 0; colonna < 4; colonna++) {
      if (
        matrice[riga][colonna] === giocatore &&
        matrice[riga + 1][colonna + 1] === giocatore &&
        matrice[riga + 2][colonna + 2] === giocatore &&
        matrice[riga + 3][colonna + 3] === giocatore
      ) {
        return true; // Vittoria diagonale
      }
    }
  }

  // Controllo vittoria diagonale (da sinistra in alto a destra in basso)
  for (let riga = 3; riga < 6; riga++) {
    for (let colonna = 0; colonna < 4; colonna++) {
      if (
        matrice[riga][colonna] === giocatore &&
        matrice[riga - 1][colonna + 1] === giocatore &&
        matrice[riga - 2][colonna + 2] === giocatore &&
        matrice[riga - 3][colonna + 3] === giocatore
      ) {
        return true; // Vittoria diagonale
      }
    }
  }

  return false; // Nessuna vittoria
}

// Funzione per creare la griglia del gioco
function creaGriglia() {
  for (let i = 0; i < righe; i++) {
    for (let j = 0; j < colonne; j++) {
      const cella = document.createElement("div");
      cella.classList.add("cella");
      cella.setAttribute("data-colonna", j);
      cella.setAttribute("data-riga", i); // Aggiunta dell'attributo data-riga
      griglia.appendChild(cella);
    }
  }
}

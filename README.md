
# Forza Quattro

Questo è il gioco forza quattro realizzato con la libreria Socket.IO per renderlo giocabile multiplayer aprendo più finestre nel browser.
## Tech Stack

**Client:** HTML, TailwindCSS, Javascript, Socket.io-client

**Server:** Node.js, Socket.IO

## Run Locally

Clone the project

```bash
  git clone https://github.com/gherardi/forza-quattro
```

Go to the project directory

```bash
  cd forza-quattro
```

Install dependencies for both client and server side

```bash
  cd client && npm install
```

```bash
  cd server && npm install
```

Start the server and the client

```bash
  cd server && npm run dev
```

```bash
  cd client && npm run dev
```

## Deployment

To deploy this project run

```bash
  cd server && npm run build
```
```bash
  cd client && npm run build
```


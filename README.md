# 🌱 Planty of Food (POF) - API Gruppi d'Acquisto

API RESTful per la gestione dei gruppi di acquisto di prodotti plant-based.

## 📖 Descrizione

Planty of Food è un'API per gestire gruppi di acquisto di prodotti plant-based. L'applicazione permette di:

- Gestire prodotti (CRUD completo)
- Gestire utenti/anagrafiche (CRUD completo)
- Gestire ordini di vendita (CRUD completo)
- Associare prodotti e utenti agli ordini
- Filtrare ordini per data e prodotto
- Unit Testing completo con Mocha, Chai e Sinon

---

## 🛠️ Tecnologie Utilizzate

### Produzione

- **Node.js** - Runtime JavaScript
- **Express** (v5.2.1) - Framework web
- **MySQL2** (v3.16.1) - Driver MySQL con supporto Promise
- **dotenv** (v17.2.3) - Gestione variabili d'ambiente

### Sviluppo

- **Nodemon** (v3.1.11) - Auto-restart durante lo sviluppo
- **Mocha** (v11.7.5) - Framework di testing
- **Chai** (v6.2.2) - Assertion library
- **Sinon** (v21.0.1) - Mocking e stubbing per test

---

## 🚀 Installazione

### Prerequisiti

- Node.js (v14 o superiore)
- MySQL (v5.7 o superiore)
- npm o yarn

### Passi

1. **Clona il repository**

   ```bash
   git clone https://github.com/tuousername/plantyoffood.git
   cd plantyoffood
   ```

2. **Installa le dipendenze**

   ```bash
   npm install
   ```

3. **Configura il database**

   Crea il database eseguendo il file `migrations.sql`:

   ```bash
   mysql -u root -p < migrations.sql
   ```

   Oppure importalo manualmente da MySQL Workbench o phpMyAdmin.

4. **Configura le variabili d'ambiente**

   Copia il file `env.example` e rinominalo in `.env`:

   ```bash
   cp env.example .env
   ```

   Modifica il file `.env` con le tue credenziali:

   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=tua_password
   DB_NAME=pof_db
   PORT=3006
   ```

5. **Avvia il server**

   Modalità sviluppo (con auto-restart):

   ```bash
   npm run dev
   ```

   Il server sarà disponibile su `http://localhost:3006`

---

## ⚙️ Configurazione

### Variabili d'Ambiente

Crea un file `.env` nella root del progetto con le seguenti variabili:

| Variabile     | Descrizione              | Valore di esempio |
| ------------- | ------------------------ | ----------------- |
| `DB_HOST`     | Host del database MySQL  | `localhost`       |
| `DB_USER`     | Username MySQL           | `root`            |
| `DB_PASSWORD` | Password MySQL           | `password123`     |
| `DB_NAME`     | Nome del database        | `pof_db`          |
| `PORT`        | Porta del server Express | `3006`            |

---

## 📁 Struttura del Progetto

```
plantyoffood/
├── src/
│   ├── controllers/          # Logica business
│   │   ├── products.controller.js
│   │   ├── users.controller.js
│   │   └── orders.controller.js
│   ├── db/                   # Configurazione database
│   │   └── connection.js
│   ├── middleware/           # Middleware di validazione
│   │   └── validators/
│   │       ├── products.validators.js
│   │       ├── users.validators.js
│   │       └── orders.validators.js
│   ├── routes/               # Definizione routes
│   │   ├── products.routes.js
│   │   ├── users.routes.js
│   │   └── orders.routes.js
│   └── app.js                # Entry point
├── test/                     # Unit tests
│   ├── controllers/
│   │   ├── users/           # 5 file di test
│   │   ├── products/        # 5 file di test
│   │   └── orders/          # 10 file di test
│   └── middleware/          # 3 file di test
├── migrations.sql            # Schema database
├── env.example              # Template variabili d'ambiente
├── .gitignore
├── package.json
└── README.md
```

---

## 🔌 API Endpoints

### 🛍️ Prodotti

| Metodo   | Endpoint        | Descrizione                   |
| -------- | --------------- | ----------------------------- |
| `POST`   | `/products`     | Crea un nuovo prodotto        |
| `GET`    | `/products`     | Ottieni tutti i prodotti      |
| `GET`    | `/products/:id` | Ottieni un prodotto specifico |
| `PUT`    | `/products/:id` | Aggiorna un prodotto          |
| `DELETE` | `/products/:id` | Elimina un prodotto           |

### 👥 Utenti

| Metodo   | Endpoint     | Descrizione                 |
| -------- | ------------ | --------------------------- |
| `POST`   | `/users`     | Crea un nuovo utente        |
| `GET`    | `/users`     | Ottieni tutti gli utenti    |
| `GET`    | `/users/:id` | Ottieni un utente specifico |
| `PUT`    | `/users/:id` | Aggiorna un utente          |
| `DELETE` | `/users/:id` | Elimina un utente           |

### 📦 Ordini

| Metodo   | Endpoint                    | Descrizione                           |
| -------- | --------------------------- | ------------------------------------- |
| `POST`   | `/orders`                   | Crea un nuovo ordine                  |
| `GET`    | `/orders`                   | Ottieni tutti gli ordini (con filtri) |
| `GET`    | `/orders/:orderId`          | Ottieni un ordine specifico           |
| `GET`    | `/orders/:orderId/users`    | Ottieni gli utenti di un ordine       |
| `GET`    | `/orders/:orderId/products` | Ottieni i prodotti di un ordine       |
| `DELETE` | `/orders/:orderId`          | Elimina un ordine                     |

### 🔗 Associazioni Ordini

| Metodo   | Endpoint                               | Descrizione                |
| -------- | -------------------------------------- | -------------------------- |
| `POST`   | `/orders/:orderId/users/:userId`       | Aggiungi utente a ordine   |
| `DELETE` | `/orders/:orderId/users/:userId`       | Rimuovi utente da ordine   |
| `POST`   | `/orders/:orderId/products/:productId` | Aggiungi prodotto a ordine |
| `DELETE` | `/orders/:orderId/products/:productId` | Rimuovi prodotto da ordine |

### 🔍 Filtri Ordini

Query parameters per `GET /orders`:

- `?startDate=YYYY-MM-DD` - Filtra ordini dalla data specificata
- `?endDate=YYYY-MM-DD` - Filtra ordini fino alla data specificata
- `?productId=1` - Filtra ordini contenenti il prodotto specificato

**Esempi**:

```
GET /orders?startDate=2026-02-01&endDate=2026-02-15
GET /orders?productId=5
GET /orders?startDate=2026-02-05&productId=3
```

---

## 📝 Esempi di Utilizzo

### Creare un Prodotto

**Request:**

```http
POST /products
Content-Type: application/json

{
  "nome": "Tofu"
}
```

**Response:**

```json
{
  "id": 1,
  "nome": "Tofu",
  "created_at": "2026-02-10T10:30:00.000Z"
}
```

### Creare un Utente

**Request:**

```http
POST /users
Content-Type: application/json

{
  "nome": "Mario",
  "cognome": "Rossi",
  "email": "mariorossi@email.com"
}
```

**Response:**

```json
{
  "id": 1,
  "nome": "Mario",
  "cognome": "Rossi",
  "email": "mariorossi@email.com",
  "created_at": "2026-02-08T10:35:00.000Z"
}
```

### Creare un Ordine

**Request:**

```http
POST /orders
```

**Response:**

```json
{
  "id": 1,
  "created_at": "2026-02-05T10:40:00.000Z"
}
```

### Aggiungere Prodotto a Ordine

**Request:**

```http
POST /orders/1/products/1
```

**Response:**

```json
{
  "id": 1,
  "order_id": "1",
  "product_id": "1"
}
```

### Aggiungere Utente a Ordine

**Request:**

```http
POST /orders/1/users/1
```

**Response:**

```json
{
  "id": 1,
  "order_id": "1",
  "user_id": "1"
}
```

### Filtrare Ordini

**Request:**

```http
GET /orders?startDate=2026-02-01&endDate=2026-02-15&productId=1
```

**Response:**

```json
[
  {
    "id": 1,
    "created_at": "2026-02-03T10:40:00.000Z"
  },
  {
    "id": 2,
    "created_at": "2026-02-12T14:20:00.000Z"
  }
]
```

### Aggiornare un Utente (parziale)

**Request:**

```http
PUT /users/1
Content-Type: application/json

{
  "email": "nuovo.email@example.com"
}
```

**Response:**

```json
{
  "id": 1,
  "nome": "Mario",
  "cognome": "Rossi",
  "email": "nuovo.email@example.com",
  "created_at": "2026-02-08T10:35:00.000Z"
}
```

---

## 🔒 Sicurezza

- **Prepared Statements**: Tutte le query utilizzano prepared statements per prevenire SQL Injection
- **Validazione Input**: Middleware di validazione su tutti gli endpoint
- **Gestione Errori**: Try-catch completi con logging
- **Integrità Referenziale**: Foreign keys con CASCADE per mantenere consistenza

---

## 🧪 Testing

Il progetto include una suite completa di **unit test** implementati con **Mocha**, **Chai** e **Sinon**.

### 📊 Copertura Test

- **23 file di test**
- **92 test cases** totali
- **31 describe blocks**

**Test implementati per**:

- Tutti i controller (users, products, orders)
- Tutti i middleware di validazione
- Scenari di successo
- Scenari di errore
- Edge cases

### 🚀 Eseguire i Test

Per eseguire tutti i test:

```bash
npm test
```

**Output atteso:**

```
  createUser Controller
    ✓ dovrebbe creare un nuovo utente e restituire 201
    ✓ dovrebbe restituire 409 se email duplicata
    ✓ dovrebbe restituire 500 per errore generico

  getUsers Controller
    ✓ dovrebbe restituire tutti gli utenti con status 200
    ✓ dovrebbe restituire array vuoto se non ci sono utenti
    ✓ dovrebbe restituire 500 in caso di errore database

  ... (altri test)

  92 passing (450ms)
```

### 📁 Struttura Test

```
test/
├── controllers/
│   ├── users/
│   │   ├── createUser.test.js       (3 test)
│   │   ├── getUsers.test.js         (3 test)
│   │   ├── getUserById.test.js      (3 test)
│   │   ├── updateUser.test.js       (5 test)
│   │   └── deleteUser.test.js       (3 test)
│   │
│   ├── products/
│   │   ├── createProduct.test.js    (2 test)
│   │   ├── getAllProducts.test.js   (3 test)
│   │   ├── getProductById.test.js   (3 test)
│   │   ├── updateProduct.test.js    (3 test)
│   │   └── deleteProduct.test.js    (3 test)
│   │
│   └── orders/
│       ├── createOrder.test.js      (2 test)
│       ├── getOrders.test.js        (5 test - include test filtri)
│       ├── getOrderById.test.js     (3 test)
│       ├── deleteOrder.test.js      (3 test)
│       ├── addUserToOrder.test.js   (5 test)
│       ├── removeUserFromOrder.test.js (4 test)
│       ├── addProductToOrder.test.js (5 test)
│       ├── removeProductFromOrder.test.js (4 test)
│       ├── getUsersOfOrder.test.js  (3 test)
│       └── getProductsOfOrder.test.js (3 test)
│
└── middleware/
    ├── users.validators.test.js     (8 test)
    ├── products.validators.test.js  (4 test)
    └── orders.validators.test.js    (12 test)
```

### 🎯 Esempio di Test

**Test per createUser**:

```javascript
describe("createUser Controller", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("dovrebbe creare un nuovo utente e restituire 201", async () => {
    const req = {
      body: { nome: "Mario", cognome: "Rossi", email: "mario@email.com" },
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    sinon.stub(db, "execute").resolves([{ insertId: 1 }, []]);

    await usersController.createUser(req, res);

    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
  });
});
```

### 🧩 Cosa Testano i Test

**Scenari di successo**:

- Creazione riuscita (status 201)
- Lettura lista completa (status 200)
- Lettura singolo elemento (status 200)
- Aggiornamento riuscito (status 200)
- Eliminazione riuscita (status 204)

**Scenari di errore**:

- Email duplicata (status 409)
- Risorsa non trovata (status 404)
- Errore database (status 500)
- Validazione fallita (status 400)

**Edge cases**:

- Liste vuote
- Aggiornamenti parziali
- Filtri combinati
- Associazioni duplicate
- Chiamate multiple al database

### 🛠️ Tecnologie Testing

**Mocha** - Test runner che organizza ed esegue i test  
**Chai** - Libreria di asserzioni per verifiche leggibili (`expect(x).to.equal(y)`)  
**Sinon** - Mocking e stubbing per simulare il comportamento del database

### 📝 Best Practices Implementate

- Pattern AAA (Arrange-Act-Assert) in ogni test
- Cleanup con `afterEach(() => sinon.restore())`
- Un file di test per ogni funzione
- Stub del database per isolare i test
- Verifica chiamate multiple al DB con `onCall`
- Commenti chiari in italiano

---

## 🗄️ Schema Database

```sql
-- Tabella Utenti
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cognome VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabella Prodotti
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabella Ordini
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabella Associazione Ordini-Utenti
CREATE TABLE order_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabella Associazione Ordini-Prodotti
CREATE TABLE order_products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
```

---

## 📚 Status Code HTTP

L'API utilizza i seguenti status code:

| Code  | Descrizione                                 |
| ----- | ------------------------------------------- |
| `200` | OK - Richiesta completata con successo      |
| `201` | Created - Risorsa creata con successo       |
| `204` | No Content - Risorsa eliminata con successo |
| `400` | Bad Request - Errore di validazione         |
| `404` | Not Found - Risorsa non trovata             |
| `409` | Conflict - Conflitto (es. email duplicata)  |
| `500` | Internal Server Error - Errore del server   |

---

## 📬 Contatti

- **GitHub:**  
  https://github.com/p4wlee

- **LinkedIn:**  
  https://www.linkedin.com/in/davide-paulicelli-00295222b/

---

## 📄 Licenza

Questo progetto è open source e disponibile sotto licenza **MIT**.
